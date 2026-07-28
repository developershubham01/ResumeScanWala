"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
}

export default function ScoreRing({
  score,
  label,
  size = 140,
  strokeWidth = 10,
  subtitle,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color based on score
  let strokeColor = "#0066cc"; // Action blue default
  let badgeBg = "bg-blue-50 text-blue-700 border-blue-200";
  let statusText = "Good Match";

  if (normalizedScore >= 80) {
    strokeColor = "#10b981"; // Emerald green
    badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    statusText = "Excellent ATS Match";
  } else if (normalizedScore >= 60) {
    strokeColor = "#f59e0b"; // Amber
    badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
    statusText = "Moderate Match";
  } else {
    strokeColor = "#ef4444"; // Red
    badgeBg = "bg-red-50 text-red-700 border-red-200";
    statusText = "Needs Improvement";
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#7a7a7a]">
            Out of 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-semibold text-[#1d1d1f]">{label}</h4>
        <span
          className={`inline-block mt-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${badgeBg}`}
        >
          {subtitle || statusText}
        </span>
      </div>
    </div>
  );
}
