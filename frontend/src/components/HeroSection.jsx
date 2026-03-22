import { ArrowRight, ChartColumn, CircleCheck, ScanSearch } from 'lucide-react'

function HeroSection() {
  const highlights = [
    { label: 'ATS score and JD match', icon: ChartColumn },
    { label: 'Missing keywords and skills', icon: ScanSearch },
    { label: 'Actionable rewrite suggestions', icon: CircleCheck },
  ]

  return (
    <section className="section-shell relative overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 grid-pattern opacity-40" />
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex items-center rounded-full border border-pine/20 bg-white/80 px-4 py-2 text-sm font-semibold text-pine">
            Free AI resume analyzer for modern job seekers
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
            Beat ATS filters and tailor every resume to the role that matters.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload your PDF or DOCX resume, paste the job description, and get a structured AI review with ATS score,
            job match percentage, missing skills, and an improved professional summary.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/#analyzer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-6 py-3 font-semibold text-white transition hover:bg-teal-700"
            >
              Start Free Analysis
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden p-8">
          <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-pine/10 blur-2xl" />
          <div className="absolute bottom-5 left-5 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="rounded-3xl bg-ink p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-white/70">Sample fit score</p>
                <p className="mt-2 font-display text-6xl font-bold">87</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Job Match</p>
                <p className="mt-1 text-2xl font-bold">91%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {highlights.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine/10 text-pine">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-slate-700">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
