import mongoose, { Schema, model, models } from "mongoose";

const SectionAnalysisSchema = new Schema({
  section: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
});

const GeminiAnalysisSchema = new Schema({
  ats_score: { type: Number, required: true },
  jd_match_percentage: { type: Number, required: true },
  missing_keywords: [{ type: String }],
  issues: [{ type: String }],
  section_analysis: [SectionAnalysisSchema],
  suggestions: [{ type: String }],
  improved_summary: { type: String, required: true },
  top_matching_skills: [{ type: String }],
  missing_skills: [{ type: String }],
});

const AnalysisSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
    fileName: { type: String, required: true },
    extractedText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    score: { type: Number, required: true },
    feedback: { type: String, required: true },
    analysis: { type: GeminiAnalysisSchema, required: true },
  },
  { timestamps: true }
);

export const Analysis = models.Analysis || model("Analysis", AnalysisSchema);
export default Analysis;
