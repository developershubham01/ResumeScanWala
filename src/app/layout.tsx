import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResumeScanWala — AI Resume Analyzer & ATS Job Matcher",
  description:
    "Scan your resume against any job description using Google Gemini AI. Get instant ATS scores, missing keywords, section breakdown, and downloadable PDF reports.",
  keywords: [
    "ATS Resume Checker",
    "Resume Analyzer",
    "Job Matcher",
    "AI Resume Scanner",
    "Resume Optimizer",
    "ResumeScanWala",
    "ATS Score",
  ],
  openGraph: {
    title: "ResumeScanWala — Free AI Resume Analyzer & ATS Job Matcher",
    description:
      "Optimize your resume for ATS algorithms and recruiters with instant Gemini AI analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f5f7] text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
