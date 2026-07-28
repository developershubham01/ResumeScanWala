"use client";

import React from "react";
import BrandLogo from "./BrandLogo";

interface HeroSectionProps {
  onStartScan: () => void;
}

export default function HeroSection({ onStartScan }: HeroSectionProps) {
  return (
    <section className="relative w-full bg-[#ffffff] pt-16 pb-20 overflow-hidden border-b border-[#f0f0f0]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-xs text-[#1d1d1f] font-medium mb-6 animate-fade-in">
          <BrandLogo size="sm" showText={false} />
          <span>Powered by Google Gemini AI & ATS Intelligence</span>
          <span className="bg-[#0066cc] text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Free
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="hero-display text-[#1d1d1f] max-w-4xl tracking-tight mb-6">
          Turn your resume into a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#1d1d1f] via-[#0066cc] to-[#0071e3] bg-clip-text text-transparent">
            recruiter magnet.
          </span>
        </h1>

        {/* Subcopy Tagline */}
        <p className="lead-text text-[#7a7a7a] max-w-2xl mb-8">
          Upload your resume, paste any job description, and get instant ATS scores, missing keywords, section breakdown, and AI improvement suggestions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={onStartScan}
            className="btn-apple-primary text-base font-normal px-7 py-3 shadow-lg"
          >
            Start Free Resume Scan
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <a
            href="#how-it-works"
            className="btn-apple-secondary text-base font-normal px-7 py-3"
          >
            How ATS Matcher Works
          </a>
        </div>

        {/* Interactive Mockup Graphic with Signature Apple Drop Shadow */}
        <div className="w-full max-w-4xl rounded-2xl bg-[#fafafc] border border-[#e0e0e0] p-6 sm:p-8 apple-product-shadow transition-transform hover:scale-[1.01] duration-300">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-[#7a7a7a] font-medium font-mono">
                ResumeScanWala — Instant AI Evaluation
              </span>
            </div>
            <span className="text-xs bg-[#0066cc]/10 text-[#0066cc] px-2.5 py-1 rounded-full font-semibold">
              Live Interactive Demo
            </span>
          </div>

          {/* Sample Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-white border border-[#f0f0f0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-[#7a7a7a]">ATS Benchmark Score</span>
                <div className="text-4xl font-bold text-[#0066cc] my-2">92 / 100</div>
                <p className="text-xs text-[#7a7a7a]">Top 5% candidate match for Senior Software Engineer</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-[#0066cc] h-full rounded-full w-[92%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#f0f0f0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-[#7a7a7a]">Missing Keywords Found</span>
                <div className="flex flex-wrap gap-1.5 my-3">
                  <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                    Kubernetes
                  </span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    CI/CD Pipelines
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    TypeScript ✓
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#0066cc] font-medium">+15 Keyword Recommendations</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#f0f0f0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-[#7a7a7a]">AI Summary Rewrite</span>
                <p className="text-xs text-[#1d1d1f] italic my-2 line-clamp-3">
                  "Senior Full-Stack Architect with 6+ years driving cloud scalability and high-impact web apps..."
                </p>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Ready for 1-Click PDF Export</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
