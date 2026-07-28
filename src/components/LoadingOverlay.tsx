"use client";

import React, { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";

interface LoadingOverlayProps {
  fileName?: string;
}

const STEPS = [
  "Reading document & extracting raw text...",
  "Parsing resume sections (Summary, Experience, Skills)...",
  "Sending structured payload to Google Gemini 2.5 Flash...",
  "Evaluating ATS Keyword Match & Job Description overlap...",
  "Generating section recommendations & improved summary...",
];

export default function LoadingOverlay({ fileName }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center animate-fade-in">
        
        {/* Animated Scanner Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[#0066cc]/20 border-t-[#0066cc] animate-spin" />
          <BrandLogo size="md" showText={false} />
        </div>

        <h3 className="text-xl font-semibold text-[#1d1d1f] mb-1">
          Analyzing {fileName || "Resume"}
        </h3>
        <p className="text-xs text-[#7a7a7a] mb-6">
          AI deep scan in progress. Please wait a few seconds.
        </p>

        {/* Step indicators */}
        <div className="space-y-3 text-left bg-[#f5f5f7] p-4 rounded-2xl border border-[#e0e0e0] mb-6">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                  isCurrent
                    ? "text-[#0066cc] font-semibold opacity-100"
                    : isDone
                    ? "text-emerald-600 font-medium opacity-80"
                    : "text-gray-400 opacity-50"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#0066cc] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0066cc] h-full transition-all duration-500 rounded-full"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
