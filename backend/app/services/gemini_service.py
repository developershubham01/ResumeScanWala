from google import genai
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.analysis import GeminiAnalysis


BASE_PROMPT = """You are an advanced ATS Resume Analyzer.
Analyze the resume against job description and return STRICT JSON with:
ats_score, jd_match_percentage, missing_keywords, issues, section_analysis, suggestions, improved_summary, top_matching_skills, missing_skills

IMPORTANT:

* Do not include text outside JSON
* Keep output structured and clean"""


class GeminiAnalyzer:
    def __init__(self) -> None:
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")
        self.client = genai.Client(api_key=settings.gemini_api_key)

    def analyze(self, resume_text: str, job_description: str) -> GeminiAnalysis:
        prompt = (
            f"{BASE_PROMPT}\n\n"
            "Return section_analysis as an array of objects with keys: section, score, feedback, strengths, improvements.\n"
            "Keep scores between 0 and 100.\n\n"
            f"RESUME:\n{resume_text}\n\n"
            f"JOB DESCRIPTION:\n{job_description}"
        )

        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": GeminiAnalysis.model_json_schema(),
            },
        )

        try:
            analysis = GeminiAnalysis.model_validate_json(response.text)
        except ValidationError as exc:
            raise ValueError("Gemini returned JSON that did not match the expected schema.") from exc

        if not analysis.section_analysis:
            analysis.section_analysis = []

        return analysis
