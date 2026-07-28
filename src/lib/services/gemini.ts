import { GoogleGenAI } from "@google/genai";

const BASE_PROMPT = `You are an advanced ATS Resume Analyzer.
Analyze the resume against the job description and return STRICT JSON with the specified schema:
- ats_score: ATS score between 0 and 100
- jd_match_percentage: JD match percentage between 0 and 100
- missing_keywords: list of important keywords missing from the resume
- issues: major issues or weaknesses found in the resume
- section_analysis: breakdown of resume sections with section name, score (0-100), detailed feedback, strengths, and improvements
- suggestions: general recommendations for improving the resume
- improved_summary: a rewritten, professional summary tailored to the job description
- top_matching_skills: key matching skills found in the resume
- missing_skills: key skills from the job description that are missing from the resume

IMPORTANT:
* Do not include any text outside the JSON response.
* Keep the output structured, clean, and valid JSON.`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    ats_score: { type: "INTEGER" },
    jd_match_percentage: { type: "INTEGER" },
    missing_keywords: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    issues: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    section_analysis: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          section: { type: "STRING" },
          score: { type: "INTEGER" },
          feedback: { type: "STRING" },
          strengths: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          improvements: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["section", "score", "feedback"]
      }
    },
    suggestions: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    improved_summary: { type: "STRING" },
    top_matching_skills: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    missing_skills: {
      type: "ARRAY",
      items: { type: "STRING" }
    }
  },
  required: [
    "ats_score",
    "jd_match_percentage",
    "missing_keywords",
    "issues",
    "section_analysis",
    "suggestions",
    "improved_summary",
    "top_matching_skills",
    "missing_skills"
  ]
};

export interface SectionAnalysis {
  section: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface GeminiAnalysis {
  ats_score: number;
  jd_match_percentage: number;
  missing_keywords: string[];
  issues: string[];
  section_analysis: SectionAnalysis[];
  suggestions: string[];
  improved_summary: string;
  top_matching_skills: string[];
  missing_skills: string[];
}

export class GeminiAnalyzer {
  private client: GoogleGenAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "PLACEHOLDER_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY is not configured in .env.local. Please retrieve a Gemini API Key from Google AI Studio and configure it."
      );
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async analyze(resumeText: string, jobDescription: string): Promise<GeminiAnalysis> {
    const prompt = `${BASE_PROMPT}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema as any,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Received empty response from Gemini AI.");
      }

      const result: GeminiAnalysis = JSON.parse(responseText);
      
      // Clean up string list values
      const normalizeList = (arr: string[] | undefined) => 
        (arr || []).map(s => s.trim()).filter(Boolean);

      result.missing_keywords = normalizeList(result.missing_keywords);
      result.issues = normalizeList(result.issues);
      result.suggestions = normalizeList(result.suggestions);
      result.top_matching_skills = normalizeList(result.top_matching_skills);
      result.missing_skills = normalizeList(result.missing_skills);
      
      if (result.section_analysis) {
        result.section_analysis = result.section_analysis.map((sec) => ({
          ...sec,
          strengths: normalizeList(sec.strengths),
          improvements: normalizeList(sec.improvements)
        }));
      } else {
        result.section_analysis = [];
      }

      return result;
    } catch (error: any) {
      console.error("Gemini analysis failed:", error);
      if (error instanceof SyntaxError) {
        throw new Error("Gemini AI returned invalid JSON. Please try again.");
      }
      throw error;
    }
  }
}
