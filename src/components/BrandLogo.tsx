import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "blue";
  className?: string;
  showText?: boolean;
}

export default function BrandLogo({
  size = "md",
  variant = "blue",
  className = "",
  showText = true,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizes = {
    sm: "text-base font-semibold tracking-tight",
    md: "text-lg font-bold tracking-tight",
    lg: "text-2xl font-bold tracking-tight",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        {/* Outer Glow / Ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#0066cc] via-[#0071e3] to-[#2997ff] opacity-90 shadow-md transform transition-transform group-hover:scale-105" />
        
        {/* Document & Scan line SVG Icon */}
        <svg
          className="relative w-3/5 h-3/5 text-white transform -rotate-3 transition-transform group-hover:rotate-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          {/* Laser Scan line effect */}
          <path
            strokeLinecap="round"
            d="M4 11h16"
            className="stroke-cyan-200 animate-pulse"
            strokeWidth="2"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} ${
            variant === "dark"
              ? "text-white"
              : variant === "light"
              ? "text-[#1d1d1f]"
              : "text-[#1d1d1f]"
          }`}
        >
          Resume<span className="text-[#0066cc]">Scan</span>Wala
        </span>
      )}
    </div>
  );
}
