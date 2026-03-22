from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.analysis import AnalysisRecord
from app.models.subscriber import SubscriberRecord
from app.schemas.analysis import AnalysisResponse, ErrorResponse
from app.schemas.subscription import SubscriptionRequest, SubscriptionResponse
from app.services.email_service import SubscriptionEmailService
from app.services.gemini_service import GeminiAnalyzer
from app.services.parser import extract_text, validate_upload

router = APIRouter()


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
    existing_subscriber = db.query(SubscriberRecord).filter(SubscriberRecord.email == payload.email).first()
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Saving the subscription failed. Please try again.",
        ) from exc

    if not settings.smtp_configured:
        return SubscriptionResponse(
            message="Subscription saved, but email notifications are not configured yet.",
            email_notification_sent=False,
            is_new_subscription=True,
        )

    try:
        SubscriptionEmailService.send_subscription_notifications(payload.email)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Subscription was saved, but sending the email notification failed.",
        ) from exc

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
        file_name=file.filename or "resume",
        file_type=extension.replace(".", "").upper(),
        extracted_text=resume_text,
        job_description=job_description.strip(),
        ats_score=analysis.ats_score,
        jd_match_percentage=analysis.jd_match_percentage,
        analysis_payload=analysis.model_dump(),
    )
    db.add(record)
    try:
        db.commit()
        db.refresh(record)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis was generated, but saving it failed. Please try again.",
        ) from exc

    return AnalysisResponse(
        analysis_id=record.id,
        file_name=record.file_name,
        created_at=record.created_at,
        extracted_characters=len(record.extracted_text),
        analysis=analysis,
    )
