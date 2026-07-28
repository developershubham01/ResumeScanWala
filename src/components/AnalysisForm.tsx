"use client";

import React, { useState, useRef } from "react";
import BrandLogo from "./BrandLogo";

interface AnalysisFormProps {
  onAnalyze: (file: File, jobDescription: string) => void;
  isLoading: boolean;
}

const SAMPLE_ROLES = [
  {
    title: "Frontend Engineer (React / Next.js)",
    jd: `We are looking for a Senior Frontend Engineer with strong expertise in React, Next.js, TypeScript, and modern CSS architectures. 
Key Responsibilities:
- Build high-performance web applications using Next.js 15, TypeScript, and Tailwind CSS.
- Optimize web application performance, bundle size, and Core Web Vitals.
- Collaborate with designers and backend engineers to integrate REST & GraphQL APIs.
- Write clean, maintainable code and unit tests.
Requirements:
- 3+ years experience with React.js and TypeScript.
- Strong knowledge of state management, Next.js App Router, SSR, and client side performance.
- Familiarity with CI/CD pipelines, Git, and automated testing (Jest, Cypress).`,
  },
  {
    title: "Full Stack Software Developer",
    jd: `Seeking a Full Stack Developer experienced in Node.js, Next.js, Python, PostgreSQL, and Cloud Deployments.
Key Responsibilities:
- Design and develop scalable microservices and RESTful API endpoints.
- Build responsive front-end user interfaces using React/Next.js.
- Work with database ORMs (Prisma, Mongoose, SQLAlchemy) and manage SQL/NoSQL schema migrations.
Requirements:
- Proven experience with JavaScript/TypeScript, Node.js, and Python.
- Knowledge of Docker, AWS/Vercel deployments, and database optimization.
- Strong problem-solving skills and experience working in Agile teams.`,
  },
  {
    title: "Product Manager (SaaS / Tech)",
    jd: `Looking for a Product Manager to lead product strategy, roadmap execution, and user experience for our SaaS platform.
Responsibilities:
- Define product requirements, user stories, and acceptance criteria.
- Analyze user metrics, retention cohorts, and A/B test results.
- Work closely with engineering and design teams to deliver product features on schedule.
Requirements:
- 3+ years of product management experience in B2B or B2C SaaS.
- Data-driven decision maker proficient with SQL, Mixpanel, or Google Analytics.
- Exceptional communication and stakeholder alignment skills.`,
  },
];

export default function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage("");
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (![".pdf", ".docx"].includes(ext)) {
      setErrorMessage("Please upload a valid .pdf or .docx document.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage("File size exceeds 5 MB maximum limit.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!file) {
      setErrorMessage("Please upload your resume file (.pdf or .docx).");
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMessage("Please enter or select a job description.");
      return;
    }

    onAnalyze(file, jobDescription.trim());
  };

  return (
    <section id="analyzer" className="w-full bg-[#f5f5f7] py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-xs border border-[#e0e0e0] mb-3">
            <BrandLogo size="sm" showText={false} />
          </div>
          <h2 className="display-lg text-[#1d1d1f] tracking-tight">
            Analyze Your Resume against Job Role
          </h2>
          <p className="text-[#7a7a7a] mt-2 text-base">
            Upload your resume document and paste the target job description to generate AI feedback.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage("")}
              className="text-red-500 hover:text-red-700 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 space-y-8">
          
          {/* Step 1: Upload File */}
          <div>
            <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 uppercase tracking-wider">
              1. Upload Resume (.PDF or .DOCX)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-[#0066cc] bg-[#0066cc]/5"
                  : file
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-[#e0e0e0] bg-white hover:border-[#0066cc] hover:bg-[#fafafc]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-between w-full max-w-md bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-[#1d1d1f] truncate max-w-[220px]">
                        {file.name}
                      </div>
                      <div className="text-xs text-[#7a7a7a]">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for parsing
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-[#1d1d1f]">
                    Drag & drop your resume file here, or <span className="text-[#0066cc] underline">browse</span>
                  </p>
                  <p className="text-xs text-[#7a7a7a] mt-1">
                    Supports PDF and DOCX documents up to 5 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Target Job Description */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="block text-sm font-semibold text-[#1d1d1f] uppercase tracking-wider">
                2. Target Job Description
              </label>
              <span className="text-xs text-[#7a7a7a]">
                Or select a preset sample role:
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SAMPLE_ROLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJobDescription(sample.jd)}
                  className="text-xs bg-white border border-[#e0e0e0] hover:border-[#0066cc] hover:text-[#0066cc] px-3 py-1.5 rounded-full text-[#1d1d1f] font-medium transition-all shadow-2xs"
                >
                  + {sample.title}
                </button>
              ))}
            </div>

            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description, role requirements, key skills, and responsibilities here..."
              className="w-full p-4 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20 outline-none transition-all placeholder:text-gray-400 font-sans"
            />
            
            <div className="flex justify-between items-center text-xs text-[#7a7a7a] mt-1.5 px-1">
              <span>Detailed job descriptions lead to higher accuracy ATS matching.</span>
              <span>{jobDescription.length} characters</span>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-apple-primary w-full sm:w-auto text-lg py-3.5 px-10 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running Gemini AI Analysis...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <BrandLogo size="sm" showText={false} />
                  Analyze Resume with Gemini AI
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
