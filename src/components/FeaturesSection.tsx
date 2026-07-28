"use client";

import React from "react";
import BrandLogo from "./BrandLogo";

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full">
      {/* Light Full-Bleed Tile */}
      <div className="w-full bg-white py-20 px-4 sm:px-6 border-b border-[#f0f0f0]">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-xs uppercase font-semibold tracking-wider text-[#0066cc] mb-2 block">
            Designed for Candidate Success
          </span>
          <h2 className="display-lg text-[#1d1d1f] mb-4">
            Pass ATS Filters with Mathematical Precision
          </h2>
          <p className="lead-text text-[#7a7a7a] max-w-2xl mx-auto mb-12">
            Most Applicant Tracking Systems automatically discard up to 75% of resumes before a human recruiter reads them. ResumeScanWala bridges the gap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-[#fafafc] border border-[#e0e0e0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                Keyword Gap Analysis
              </h3>
              <p className="text-xs text-[#7a7a7a] leading-relaxed">
                Identifies missing technical terms, certifications, and hard skills required by job posters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafafc] border border-[#e0e0e0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                Section-Wise Feedback
              </h3>
              <p className="text-xs text-[#7a7a7a] leading-relaxed">
                Breaks down your summary, experience bullet points, and skills list with targeted scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fafafc] border border-[#e0e0e0] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f]">
                Instant PDF Export
              </h3>
              <p className="text-xs text-[#7a7a7a] leading-relaxed">
                Download high-resolution evaluation reports and AI-optimized summary rewrites for free.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Full-Bleed Tile */}
      <div className="w-full bg-[#272729] text-white py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium mb-4">
            <BrandLogo size="sm" variant="dark" showText={false} />
            <span>Google Gemini 2.5 Flash Engine</span>
          </div>

          <h2 className="display-lg text-white mb-4">
            Powered by Advanced Generative AI
          </h2>
          <p className="lead-text text-gray-300 max-w-2xl mx-auto mb-12">
            No dummy templates or generic rules. Get deep, contextual recommendations tailored to your exact industry and target position.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-8 rounded-2xl bg-[#2a2a2c] border border-white/10 space-y-3">
              <span className="text-xs text-[#2997ff] font-semibold uppercase tracking-wider">
                Tailored Bullet Rewrite
              </span>
              <h3 className="text-xl font-bold text-white">
                Turn Responsibilities into Quantified Achievements
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Gemini rewrites passive job duties into high-impact bullet points with metrics, percentages, and leadership action verbs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#2a2a2c] border border-white/10 space-y-3">
              <span className="text-xs text-[#2997ff] font-semibold uppercase tracking-wider">
                100% Confidential
              </span>
              <h3 className="text-xl font-bold text-white">
                Privacy-First Document Processing
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your resume is parsed in memory and analyzed over encrypted HTTPS. We never sell or share candidate data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
