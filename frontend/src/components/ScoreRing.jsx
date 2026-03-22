import { clampScore } from '../utils/helpers'

function ScoreRing({ score, label, accent = '#0f766e' }) {
  const normalized = clampScore(score)
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalized / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={accent}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold">{normalized}</span>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">out of 100</span>
        </div>
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  )
}

export default ScoreRing
