"use client";

import React, { useState } from "react";
import BrandLogo from "./BrandLogo";

interface GlobalNavProps {
  onScanClick?: () => void;
}

export default function GlobalNav({ onScanClick }: GlobalNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#000000] text-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 h-[44px] flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <BrandLogo size="sm" variant="dark" />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-8 text-[12px] font-normal tracking-tight text-[#e0e0e0]">
          <a
            href="#analyzer"
            className="hover:text-white transition-colors duration-150 py-2"
          >
            AI Analyzer
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors duration-150 py-2"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-150 py-2"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors duration-150 py-2"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScanClick}
            className="text-[12px] bg-[#0066cc] hover:bg-[#0071e3] text-white px-3.5 py-1.5 min-h-[32px] rounded-full font-medium transition-all transform active:scale-95 shadow-sm"
          >
            Scan Resume
          </button>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-300 hover:text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-white/10 px-4 py-4 space-y-3 animate-fade-in">
          <a
            href="#analyzer"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-200 hover:text-white py-2 border-b border-white/5"
          >
            AI Resume Analyzer
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-200 hover:text-white py-2 border-b border-white/5"
          >
            Features & Capabilities
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-200 hover:text-white py-2 border-b border-white/5"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-200 hover:text-white py-2"
          >
            Frequently Asked Questions
          </a>
        </div>
      )}
    </header>
  );
}
