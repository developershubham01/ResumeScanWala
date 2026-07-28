"use client";

import React, { useState } from "react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Thank you for subscribing to career & ATS insights!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.detail || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="w-full bg-[#f5f5f7] border-t border-[#e0e0e0] pt-16 pb-12 px-4 sm:px-6 text-[#333333]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#e0e0e0]">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" variant="blue" />
            <p className="text-xs text-[#7a7a7a] max-w-sm leading-relaxed">
              ResumeScanWala is a free AI-powered ATS resume analyzer and job matcher. Land more interviews by optimizing your resume for recruiters and search algorithms.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1.5 uppercase tracking-wider">
                Get Free ATS Tips & Resume Templates
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#e0e0e0] rounded-full focus:border-[#0066cc] outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-apple-primary text-xs py-2 px-4"
                >
                  Subscribe
                </button>
              </div>

              {msg && (
                <p
                  className={`text-xs mt-2 ${
                    status === "success" ? "text-emerald-600 font-medium" : "text-red-600"
                  }`}
                >
                  {msg}
                </p>
              )}
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-[#1d1d1f] tracking-wider">
              Product Features
            </h4>
            <ul className="space-y-2 text-xs text-[#7a7a7a]">
              <li><a href="#analyzer" className="hover:text-[#0066cc] transition-colors">ATS Score Analyzer</a></li>
              <li><a href="#analyzer" className="hover:text-[#0066cc] transition-colors">Job Description Matcher</a></li>
              <li><a href="#features" className="hover:text-[#0066cc] transition-colors">Missing Keyword Detector</a></li>
              <li><a href="#features" className="hover:text-[#0066cc] transition-colors">AI Summary Generator</a></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-[#1d1d1f] tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#7a7a7a]">
              <li><a href="#faq" className="hover:text-[#0066cc] transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#" className="hover:text-[#0066cc] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#0066cc] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#0066cc] transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7a7a7a] gap-4">
          <p>© {new Date().getFullYear()} ResumeScanWala. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span>Sales & Refunds</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
