from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class SectionAnalysis(BaseModel):
    section: str = Field(..., description="Resume section name.")
    score: int = Field(..., ge=0, le=100, description="Section-specific ATS strength score.")
    feedback: str = Field(..., description="Detailed feedback for the section.")
    strengths: list[str] = Field(default_factory=list, description="What works well in this section.")
    improvements: list[str] = Field(default_factory=list, description="What should be improved.")


class GeminiAnalysis(BaseModel):
    ats_score: int = Field(..., ge=0, le=100)
    jd_match_percentage: int = Field(..., ge=0, le=100)
    missing_keywords: list[str] = Field(default_factory=list)
    issues: list[str] = Field(default_factory=list)
    section_analysis: list[SectionAnalysis] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)
    improved_summary: str = Field(..., min_length=1)
    top_matching_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)

    @field_validator("missing_keywords", "issues", "suggestions", "top_matching_skills", "missing_skills")
    @classmethod
    def normalize_list_values(cls, values: list[str]) -> list[str]:
        normalized: list[str] = []
        for value in values:
            item = value.strip()
            if item and item not in normalized:
                normalized.append(item)
        return normalized


class AnalysisResponse(BaseModel):
    analysis_id: str
    file_name: str
    created_at: datetime
    extracted_characters: int
    analysis: GeminiAnalysis


class ErrorResponse(BaseModel):
    detail: str

