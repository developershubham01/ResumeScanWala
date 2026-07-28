"use client";

import React, { useState } from "react";

const FAQS = [
  {
    q: "What is an ATS and how does ResumeScanWala analyze it?",
    a: "An Applicant Tracking System (ATS) is software used by employers to screen, sort, and rank resumes based on keyword match, job title relevance, skills, and formatting. ResumeScanWala uses Google Gemini AI to compare your resume text directly against the target job description to compute an accurate ATS match score.",
  },
  {
    q: "Which file formats are supported?",
    a: "ResumeScanWala supports PDF (.pdf) and Microsoft Word (.docx) documents up to 5 MB in size.",
  },
  {
    q: "Is ResumeScanWala completely free to use?",
    a: "Yes! ResumeScanWala offers free AI resume scanning, ATS keyword matching, section feedback, and PDF report downloads.",
  },
  {
    q: "Is my personal resume data stored or shared?",
    a: "No. Your resume is processed strictly for analysis. We maintain strict privacy standards and do not share your document with third parties.",
  },
  {
    q: "How can I get a score above 85%?",
    a: "To achieve an 85%+ ATS score, incorporate the missing keywords suggested by our analysis, quantify your achievements with numerical metrics (e.g., 'increased sales by 35%'), and ensure your professional summary aligns with the target job title.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full bg-[#f5f5f7] py-20 px-4 sm:px-6 border-b border-[#e0e0e0]">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="display-lg text-[#1d1d1f]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#7a7a7a] mt-2">
            Everything you need to know about ATS optimization and AI resume scoring.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left font-semibold text-[#1d1d1f] flex items-center justify-between gap-4 text-base hover:text-[#0066cc]"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-bold text-[#7a7a7a]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#7a7a7a] leading-relaxed border-t border-[#f0f0f0] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
