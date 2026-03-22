import { CheckCircle2, Gauge, Sparkles, Wifi } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import BrandMark from './BrandMark'

const LOADING_STEPS = [
  'Uploading your resume',
  'Extracting readable text',
  'Matching against the job description',
  'Scoring ATS readiness',
  'Preparing improvement suggestions',
]

function LoadingOverlay() {
  const [progress, setProgress] = useState(12)
  const [stepIndex, setStepIndex] = useState(0)
  const [slowNetwork, setSlowNetwork] = useState(false)

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current
        }

        return current + (current < 60 ? 8 : 4)
      })
    }, 900)

    const stepTimer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % LOADING_STEPS.length)
    }, 1800)

    const networkTimer = window.setTimeout(() => {
      setSlowNetwork(true)
    }, 6500)

    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(stepTimer)
      window.clearTimeout(networkTimer)
    }
  }, [])

  const activeStep = useMemo(() => LOADING_STEPS[stepIndex], [stepIndex])

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-gradient-to-r from-ink via-slate-900 to-pine px-6 py-6 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <BrandMark
              className="text-white"
              iconClassName="h-14 w-14 rounded-3xl border-white/20 bg-white/10"
              titleClassName="text-2xl text-white"
              subtitleClassName="text-sm text-white/65"
            />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Live Analysis</p>
            <h3 className="mt-2 font-display text-2xl font-bold">Analyzing your resume</h3>
          </div>
          <div className="relative flex h-20 w-20 items-center justify-center self-start">
            <span className="absolute inline-flex h-full w-full rounded-[1.75rem] bg-white/10 animate-pulseRing" />
            <span className="absolute inline-flex h-16 w-16 rounded-[1.4rem] border border-white/15 bg-white/5" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-white shadow-lg shadow-slate-950/20">
              <img src="/favicon.svg" alt="" aria-hidden="true" className="h-8 w-8 animate-float object-contain" />
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-600">
            <span>{activeStep}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pine via-teal-500 to-clay transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-pine">
              <Gauge className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">ATS Engine</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-clay">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">AI Feedback</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-olive">
              <Wifi className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Connection</p>
            </div>
            <div className="mt-4 rounded-2xl bg-white px-4 py-4 text-sm text-slate-600">
              {slowNetwork
                ? 'Network looks slow. The analysis is still running, similar to a streaming-style loading state.'
                : 'Connection is stable. Results will appear automatically when analysis finishes.'}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-[#fff8f1] px-5 py-4 text-sm text-slate-600">
            {slowNetwork
              ? 'This can take a little longer on slower networks or when Gemini is busy. Please keep this tab open.'
              : 'We are parsing your resume, comparing it with the role, and generating structured recommendations.'}
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Structured analysis mode active
            </div>
            <p className="mt-2 leading-6 text-emerald-700">
              Your upload stays in the branded analyzer flow until results are ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
