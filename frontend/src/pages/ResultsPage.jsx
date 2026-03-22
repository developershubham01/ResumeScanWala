import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import ResultDashboard from '../components/ResultDashboard'
import { useAnalysis } from '../hooks/useAnalysis'
import { siteConfig } from '../siteConfig'

function ResultsPage() {
  const navigate = useNavigate()
  const { analysisResult, resetAnalysis } = useAnalysis()

  const handleDeleteResult = () => {
    resetAnalysis()
    navigate('/')
  }

  if (!analysisResult) {
    return (
      <section className="section-shell py-20">
        <div className="glass-card mx-auto max-w-2xl p-10 text-center">
          <h1 className="font-display text-4xl font-bold">No analysis found</h1>
          <p className="mt-4 text-slate-600">
            Upload a resume and paste a job description first so the dashboard has data to display.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analyzer
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>Resume Analysis Results | {siteConfig.appName}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ResultDashboard result={analysisResult} onDeleteResult={handleDeleteResult} />
    </>
  )
}

export default ResultsPage
