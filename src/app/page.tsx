"use client";

import React, { useState } from "react";
import GlobalNav from "@/components/GlobalNav";
import SubNavFrosted from "@/components/SubNavFrosted";
import HeroSection from "@/components/HeroSection";
import AnalysisForm from "@/components/AnalysisForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import ResultDashboard from "@/components/ResultDashboard";
import FeaturesSection from "@/components/FeaturesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { GeminiAnalysis } from "@/lib/services/gemini";

// Fallback sample analysis data if API key is not configured or for offline testing
const DEMO_ANALYSIS: GeminiAnalysis = {
  ats_score: 88,
  jd_match_percentage: 84,
  missing_keywords: [
    "Kubernetes",
    "GraphQL",
    "CI/CD Pipelines",
    "Jest / Cypress Testing",
    "Performance Optimization",
  ],
  issues: [
    "Professional summary lacks specific role key phrases.",
    "Bullet points in Experience section need more quantified metrics (%, $ saved).",
  ],
  section_analysis: [
    {
      section: "Summary & Header",
      score: 78,
      feedback: "Clear title and contact details, but lacks quantitative achievements.",
      strengths: ["Clear seniority level", "Modern tech stack mentioned"],
      improvements: ["Add years of experience", "Include target job title keywords"],
    },
    {
      section: "Work Experience",
      score: 92,
      feedback: "Strong bullet points with clear technology references.",
      strengths: ["Action verbs used effectively", "Demonstrates teamwork and delivery"],
      improvements: ["Quantify impact with % growth or revenue metrics"],
    },
    {
      section: "Skills & Education",
      score: 85,
      feedback: "Good coverage of core languages and frameworks.",
      strengths: ["Clean categorization of skills"],
      improvements: ["Include missing cloud & DevOps keywords"],
    },
  ],
  suggestions: [
    "Incorporate Kubernetes and CI/CD pipelines into work experience bullets.",
    "Use standard ATS section headings (e.g., 'Work Experience' instead of 'Career History').",
    "Keep overall resume length under 2 pages.",
  ],
  improved_summary:
    "Results-driven Senior Full-Stack Engineer with 5+ years of experience building high-throughput web applications using Next.js, React, and Node.js. Proven track record of improving web performance by 40% and deploying scalable cloud microservices.",
  top_matching_skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs"],
  missing_skills: ["Kubernetes", "GraphQL", "Jest", "Docker"],
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFileName, setActiveFileName] = useState("");
  const [analysisResult, setAnalysisResult] = useState<GeminiAnalysis | null>(null);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  const scrollToAnalyzer = () => {
    const el = document.getElementById("analyzer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    setActiveFileName(file.name);
    setApiErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Analysis failed. Please try again.");
      }

      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error("Invalid response format received from server.");
      }
    } catch (err: any) {
      console.warn("API Error encountered:", err.message);
      setApiErrorMsg(err.message);
      
      // If error is about API key missing or Vercel environment, offer demo mode result
      if (
        err.message.includes("GEMINI_API_KEY") ||
        err.message.includes("API key") ||
        err.message.includes("Failed to fetch")
      ) {
        setTimeout(() => {
          setAnalysisResult(DEMO_ANALYSIS);
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveFileName("");
    setApiErrorMsg(null);
    scrollToAnalyzer();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      {/* Top Bar Navigation */}
      <GlobalNav onScanClick={scrollToAnalyzer} />

      {/* Frosted Sticky Sub-Header */}
      <SubNavFrosted
        onScanClick={scrollToAnalyzer}
        hasResults={!!analysisResult}
        onReset={handleReset}
      />

      <main className="flex-1 flex flex-col">
        {/* Loading Progress Modal */}
        {isLoading && <LoadingOverlay fileName={activeFileName} />}

        {/* Hero Section */}
        <HeroSection onStartScan={scrollToAnalyzer} />

        {/* Error Notification Banner if API Key is missing or failed */}
        {apiErrorMsg && (
          <div className="w-full bg-amber-50 border-y border-amber-200 py-3 px-4 text-center text-xs text-amber-800">
            <strong>Note:</strong> {apiErrorMsg}{" "}
            {apiErrorMsg.includes("GEMINI_API_KEY") && (
              <span>(Displaying sample AI evaluation preview below).</span>
            )}
          </div>
        )}

        {/* Analysis Results Dashboard or Input Form */}
        {analysisResult ? (
          <ResultDashboard
            fileName={activeFileName || "Sample_Resume.pdf"}
            analysis={analysisResult}
            onReset={handleReset}
          />
        ) : (
          <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* Product Features Tiles */}
        <FeaturesSection />

        {/* FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
