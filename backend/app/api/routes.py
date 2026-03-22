import json
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.analysis import AnalysisRecord
from app.models.subscriber import SubscriberRecord
from app.schemas.analysis import AnalysisResponse, ErrorResponse, GeminiAnalysis
from app.schemas.subscription import SubscriptionRequest, SubscriptionResponse
from app.services.email_service import SubscriptionEmailService
from app.services.gemini_service import GeminiAnalyzer
from app.services.parser import extract_text, validate_upload

router = APIRouter()
logger = logging.getLogger(__name__)


def _build_feedback_text(analysis: GeminiAnalysis) -> str:
    feedback_sections: list[str] = []

    if analysis.improved_summary.strip():
        feedback_sections.append(f"Improved summary: {analysis.improved_summary.strip()}")

    if analysis.issues:
        feedback_sections.append(f"Issues: {', '.join(analysis.issues)}")

    if analysis.suggestions:
        feedback_sections.append(f"Suggestions: {', '.join(analysis.suggestions)}")

    if analysis.missing_keywords:
        feedback_sections.append(f"Missing keywords: {', '.join(analysis.missing_keywords)}")

    if analysis.missing_skills:
        feedback_sections.append(f"Missing skills: {', '.join(analysis.missing_skills)}")

    for section in analysis.section_analysis:
        feedback_sections.append(
            f"{section.section} ({section.score}/100): {section.feedback}"
        )

    if feedback_sections:
        return "\n\n".join(feedback_sections)

    return json.dumps(analysis.model_dump(), ensure_ascii=False)


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@router.post(
    "/subscribe",
    response_model=SubscriptionResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
def subscribe(
    payload: SubscriptionRequest,
    db: Session = Depends(get_db),
) -> SubscriptionResponse:
    try:
        existing_subscriber = db.query(SubscriberRecord).filter(SubscriberRecord.email == payload.email).first()
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Subscriber lookup failed.")
        return SubscriptionResponse(
            message="Subscription request was received, but saving is temporarily unavailable.",
            email_notification_sent=False,
            is_new_subscription=False,
        )

    if existing_subscriber:
        return SubscriptionResponse(
            message="This email is already subscribed.",
            email_notification_sent=False,
            is_new_subscription=False,
        )

    subscriber = SubscriberRecord(email=payload.email)
    db.add(subscriber)
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Saving the subscription failed.")
        return SubscriptionResponse(
            message="Subscription request was received, but saving is temporarily unavailable.",
            email_notification_sent=False,
            is_new_subscription=False,
        )

    if not settings.smtp_configured:
        return SubscriptionResponse(
            message="Subscription saved, but email notifications are not configured yet.",
            email_notification_sent=False,
            is_new_subscription=True,
        )

    try:
        SubscriptionEmailService.send_subscription_notifications(payload.email)
    except Exception as exc:
        logger.exception("Subscription email notification failed after the subscriber was saved.")
        return SubscriptionResponse(
            message="Subscribed successfully, but the email notification could not be sent.",
            email_notification_sent=False,
            is_new_subscription=True,
        )

    return SubscriptionResponse(
        message="Subscribed successfully. A notification email has been sent.",
        email_notification_sent=True,
        is_new_subscription=True,
    )


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={
        400: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
    },
)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
) -> AnalysisResponse:
    if not job_description.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job description is required.")

    file_bytes = await file.read()
    extension = validate_upload(file.filename or "resume", len(file_bytes))
    resume_text = extract_text(file_bytes, extension)

    try:
        gemini_analyzer = GeminiAnalyzer()
        analysis = gemini_analyzer.analyze(resume_text=resume_text, job_description=job_description.strip())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini analysis failed. Please verify the API key and try again.",
        ) from exc

    record = AnalysisRecord(
        extracted_text=resume_text,
        job_description=job_description.strip(),
        score=analysis.ats_score,
        feedback=_build_feedback_text(analysis),
    )
    db.add(record)
    try:
        db.commit()
        db.refresh(record)
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("Analysis save failed after Gemini response was generated.")
        return AnalysisResponse(
            analysis_id=0,
            file_name=file.filename or "resume",
            created_at=datetime.utcnow(),
            extracted_characters=len(resume_text),
            analysis=analysis,
        )

    return AnalysisResponse(
        analysis_id=record.id,
        file_name=file.filename or "resume",
        created_at=record.created_at,
        extracted_characters=len(record.extracted_text),
        analysis=analysis,
    )
