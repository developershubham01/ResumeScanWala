from io import BytesIO
from pathlib import Path

import fitz
from docx import Document
from fastapi import HTTPException, status

from app.core.config import settings


SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def validate_upload(file_name: str, file_size: int) -> str:
    extension = Path(file_name).suffix.lower()
    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a PDF or DOCX file.",
        )

    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File is too large. Maximum allowed size is {settings.max_file_size_mb} MB.",
        )

    return extension


def extract_text(file_bytes: bytes, extension: str) -> str:
    if extension == ".pdf":
        return _extract_pdf_text(file_bytes)
    if extension == ".docx":
        return _extract_docx_text(file_bytes)

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file format.")


def _extract_pdf_text(file_bytes: bytes) -> str:
    try:
        with fitz.open(stream=file_bytes, filetype="pdf") as document:
            text = "\n".join(page.get_text("text") for page in document)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The PDF file could not be read. Please upload a valid PDF.",
        ) from exc

    return _clean_text(text)


def _extract_docx_text(file_bytes: bytes) -> str:
    try:
        document = Document(BytesIO(file_bytes))
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The DOCX file could not be read. Please upload a valid DOCX.",
        ) from exc

    return _clean_text(text)


def _clean_text(text: str) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    cleaned = "\n".join(lines)

    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No readable text was found in the uploaded resume.",
        )

    return cleaned

