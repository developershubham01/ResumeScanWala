import { FileSearch, Github, House } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { useAnalysis } from '../hooks/useAnalysis'
import { siteConfig } from '../siteConfig'

function Header() {
  const { analysisResult } = useAnalysis()

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fffaf5]/85 backdrop-blur">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
            <FileSearch className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">{siteConfig.appName}</p>
            <p className="text-xs text-slate-500">Free ATS score and job match insights</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="/#features">Features</a>
          <a href="/#analyzer">Analyzer</a>
          {analysisResult && (
            <NavLink to="/results" className="text-pine">
              Results
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Go to home page"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
          >
            <House className="h-5 w-5" />
          </Link>
          <a
            href="https://github.com/developershubham01"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub profile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-ink"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
