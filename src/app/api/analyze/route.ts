import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { Analysis } from "@/lib/models/Analysis";
import { validateUpload, extractText } from "@/lib/services/parser";
import { GeminiAnalyzer, GeminiAnalysis } from "@/lib/services/gemini";

export const maxDuration = 60; // Extend Vercel runtime to 60 seconds (since Gemini API + parsing might take time)

function buildFeedbackText(analysis: GeminiAnalysis): string {
  const sections: string[] = [];

  if (analysis.improved_summary?.trim()) {
    sections.push(`Improved summary: ${analysis.improved_summary.trim()}`);
  }

  if (analysis.issues?.length) {
    sections.push(`Issues: ${analysis.issues.join(", ")}`);
  }

  if (analysis.suggestions?.length) {
    sections.push(`Suggestions: ${analysis.suggestions.join(", ")}`);
  }

  if (analysis.missing_keywords?.length) {
    sections.push(`Missing keywords: ${analysis.missing_keywords.join(", ")}`);
  }

  if (analysis.missing_skills?.length) {
    sections.push(`Missing skills: ${analysis.missing_skills.join(", ")}`);
  }

  if (analysis.section_analysis?.length) {
    analysis.section_analysis.forEach((sec) => {
      sections.push(`${sec.section} (${sec.score}/100): ${sec.feedback}`);
    });
  }

  if (sections.length > 0) {
    return sections.join("\n\n");
  }

  return JSON.stringify(analysis);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = formData.get("job_description") as string | null;

    if (!file) {
      return NextResponse.json({ detail: "Resume file is required." }, { status: 400 });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ detail: "Job description is required." }, { status: 400 });
    }

    const fileBytes = Buffer.from(await file.arrayBuffer());
    
    // Validate upload and extract text
    let extension: string;
    try {
      extension = validateUpload(file.name, fileBytes.length);
    } catch (err: any) {
      return NextResponse.json({ detail: err.message }, { status: 400 });
    }

    let resumeText: string;
    try {
      resumeText = await extractText(fileBytes, extension);
    } catch (err: any) {
      return NextResponse.json({ detail: err.message }, { status: 400 });
    }

    // Call Gemini AI
    let analysis: GeminiAnalysis;
    try {
      const analyzer = new GeminiAnalyzer();
      analysis = await analyzer.analyze(resumeText, jobDescription.trim());
    } catch (err: any) {
      console.error("Gemini service error:", err);
      return NextResponse.json(
        { detail: err.message || "Gemini analysis failed. Please verify the API key and try again." },
        { status: 502 }
      );
    }

    // Connect to database
    await dbConnect();

    // Create Analysis Document
    const analysisRecord = new Analysis({
      userId,
      fileName: file.name,
      extractedText: resumeText,
      jobDescription: jobDescription.trim(),
      score: analysis.ats_score,
      feedback: buildFeedbackText(analysis),
      analysis,
    });

    try {
      await analysisRecord.save();
    } catch (dbErr) {
      console.error("Failed to save analysis to MongoDB:", dbErr);
      // Return the analysis anyway even if saving failed, so the user gets their result.
      return NextResponse.json({
        analysis_id: "temporary-id",
        file_name: file.name,
        created_at: new Date().toISOString(),
        extracted_characters: resumeText.length,
        analysis,
      });
    }

    return NextResponse.json({
      analysis_id: analysisRecord._id.toString(),
      file_name: file.name,
      created_at: analysisRecord.createdAt.toISOString(),
      extracted_characters: resumeText.length,
      analysis,
    });
  } catch (error: any) {
    console.error("Analysis handler error:", error);
    return NextResponse.json(
      { detail: "Internal server error occurred during resume analysis." },
      { status: 500 }
    );
  }
}
