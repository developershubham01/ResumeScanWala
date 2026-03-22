import { Helmet } from 'react-helmet-async'
import { Check, FileBadge2, Gauge, WandSparkles } from 'lucide-react'

import AnalysisForm from '../components/AnalysisForm'
import HeroSection from '../components/HeroSection'

function HomePage() {
  const features = [
    {
      title: 'Upload and parse resume files',
      description: 'Works with PDF and DOCX resumes using backend document parsing.',
      icon: FileBadge2,
    },
    {
      title: 'Measure ATS readiness',
      description: 'Get ATS score, job match percentage, and section-level breakdowns in one pass.',
      icon: Gauge,
    },
    {
      title: 'AI-powered improvement tips',
      description: 'See missing keywords, missing skills, and a rewritten summary you can adapt.',
      icon: WandSparkles,
    },
  ]

  const steps = ['Upload resume', 'Paste job description', 'Review ATS score', 'Download report as PDF']

  return (
    <>
      <Helmet>
        <title>Free AI Resume Analyzer | ATS Score Checker</title>
        <meta
          name="description"
          content="Analyze your resume with AI, get ATS score, job match, and improve your chances. 100% free."
        />
      </Helmet>

      <HeroSection />
      <AnalysisForm />

      <section id="features" className="section-shell py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="glass-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine/10 text-pine">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">{feature.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="glass-card overflow-hidden lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-ink p-8 text-white lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">How it works</p>
            <h2 className="mt-4 font-display text-4xl font-bold">A clean workflow for faster job applications.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/75">
              This app is designed for fast loading and mobile-first usability, while still surfacing the feedback that
              matters for recruiter screening and ATS systems.
            </p>
          </div>

          <div className="grid gap-4 p-8 lg:p-10">
            {steps.map((step) => (
              <div key={step} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-white">
                  <Check className="h-5 w-5" />
                </div>
                <p className="font-semibold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
