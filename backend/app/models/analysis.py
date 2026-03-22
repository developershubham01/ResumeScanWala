import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, Integer, String, Text
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(10), nullable=False)
    extracted_text: Mapped[str] = mapped_column(Text().with_variant(LONGTEXT(), "mysql"), nullable=False)
    job_description: Mapped[str] = mapped_column(Text().with_variant(LONGTEXT(), "mysql"), nullable=False)
    ats_score: Mapped[int] = mapped_column(Integer, nullable=False)
    jd_match_percentage: Mapped[int] = mapped_column(Integer, nullable=False)
    analysis_payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
