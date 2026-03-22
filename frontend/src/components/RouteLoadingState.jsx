import { Gauge, Sparkles } from 'lucide-react'

import BrandMark from './BrandMark'

function RouteLoadingState() {
  return (
    <section className="section-shell py-14 lg:py-20">
      <div className="glass-card relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(194,65,12,0.12),transparent_28%)]" />

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <BrandMark iconClassName="h-14 w-14 rounded-3xl" titleClassName="text-2xl" subtitleClassName="text-sm" />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-pine">Loading Workspace</p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink">
              Preparing the analyzer interface with your branded experience.
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              We are loading the route, prefetching the UI, and restoring the latest analysis state.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <span className="absolute inline-flex h-full w-full rounded-2xl bg-white/10 animate-pulseRing" />
                  <img src="/favicon.svg" alt="" aria-hidden="true" className="relative h-6 w-6 animate-float" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">Resume Engine</p>
                  <p className="mt-1 font-display text-xl font-bold">Loading modules</p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-pine">
                  <Gauge className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Route Status</p>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-pine via-teal-500 to-clay animate-pulse" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-3/5 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>

              <div className="rounded-3xl bg-[#fff8f1] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Session Restore</p>
                <p className="mt-4 leading-7 text-slate-600">
                  Cached analysis data, routes, and dashboard chunks are being restored so the page feels instant after
                  load.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RouteLoadingState
