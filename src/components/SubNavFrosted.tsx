"use client";

import React from "react";
import BrandLogo from "./BrandLogo";

interface SubNavFrostedProps {
  onScanClick: () => void;
  hasResults?: boolean;
  onReset?: () => void;
}

export default function SubNavFrosted({
  onScanClick,
  hasResults,
  onReset,
}: SubNavFrostedProps) {
  return (
    <nav className="sticky top-[44px] z-40 w-full glass-frosted-nav border-b border-black/[0.06]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 h-[52px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" variant="blue" showText={true} />
          <span className="hidden sm:inline-block text-xs font-medium text-[#7a7a7a] border-l border-gray-300 pl-3">
            Gemini 2.5 Flash Engine
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasResults && onReset && (
            <button
              onClick={onReset}
              className="text-xs text-[#0066cc] hover:underline font-medium px-2 py-1"
            >
              Scan Another Resume
            </button>
          )}

          <button
            onClick={onScanClick}
            className="btn-apple-primary text-xs py-1.5 px-4 h-8"
          >
            Upload & Analyze
          </button>
        </div>
      </div>
    </nav>
  );
}
