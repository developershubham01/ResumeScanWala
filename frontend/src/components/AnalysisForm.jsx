import { AlertCircle, FileUp, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAnalysis } from '../hooks/useAnalysis'
import LoadingOverlay from './LoadingOverlay'

function AnalysisForm() {
  const navigate = useNavigate()
  const { analyzeResume, error, isAnalyzing, setError } = useAnalysis()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      setError('Please upload a resume in PDF or DOCX format.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please paste the job description before running the analysis.')
      return
    }

    try {
      await analyzeResume({ file, jobDescription })
      navigate('/results')
    } catch {
      // The context already stores the error for display.
    }
  }

  return (
    <section id="analyzer" className="section-shell py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pine">Instant Resume Audit</p>
          <h2 className="mt-4 font-display text-3xl font-bold">Upload once. Tailor every application faster.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            This free AI resume analyzer compares your resume directly against a specific job description so you can
            spot ATS blockers, keyword gaps, and weak sections before you apply.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'ATS score from 0 to 100',
              'Missing keywords and missing skills',
              'Section-wise breakdown with targeted suggestions',
              'Improved summary rewrite for future edits',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-pine" />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8">
          {isAnalyzing ? (
            <LoadingOverlay />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Resume Upload
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-pine hover:bg-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pine/10 text-pine">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-lg font-semibold">Drop your resume here or click to browse</p>
                  <p className="mt-2 text-sm text-slate-500">Accepted formats: PDF and DOCX, up to 5 MB</p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                  />
                </label>
                {file && (
                  <p className="mt-3 rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-pine">{file.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="jobDescription"
                  className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
                >
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  placeholder="Paste the full job description here so the AI can compare your resume against the target role."
                  className="min-h-[220px] w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-base outline-none transition focus:border-pine focus:ring-4 focus:ring-pine/10"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                <Sparkles className="h-5 w-5" />
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default AnalysisForm
