import { Download, Lightbulb, ScanSearch, Sparkles, Trash2, TriangleAlert } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { buildSectionChartData, formatDate } from '../utils/helpers'
import ScoreRing from './ScoreRing'

function ResultDashboard({ result, onDeleteResult }) {
  const { analysis } = result
  const matchedSkills = analysis.top_matching_skills ?? []
  const missingSkills = analysis.missing_skills ?? []
  const missingKeywords = analysis.missing_keywords ?? []
  const issues = analysis.issues ?? []
  const suggestions = analysis.suggestions ?? []
  const sectionAnalysis = analysis.section_analysis ?? []

  const scoreData = [
    { name: 'ATS', value: analysis.ats_score, fill: '#0f766e' },
    { name: 'Job Match', value: analysis.jd_match_percentage, fill: '#c2410c' },
  ]

  const sectionChartData = buildSectionChartData(sectionAnalysis)

  const handleDownload = async () => {
    const { downloadAnalysisPdf } = await import('../utils/report')
    downloadAnalysisPdf(result)
  }

  return (
    <section className="section-shell py-12 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pine">Analysis Complete</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Resume results for {result.file_name}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Generated on {formatDate(result.created_at)} with {result.extracted_characters.toLocaleString()} extracted
            characters from your resume.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Download PDF Report
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card min-w-0 p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <ScoreRing score={analysis.ats_score} label="ATS Score" />
            <ScoreRing score={analysis.jd_match_percentage} label="JD Match" accent="#c2410c" />
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Matched Skills</p>
              {matchedSkills.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-mist px-3 py-2 text-sm font-medium text-pine">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No matching skills were returned for this analysis.</p>
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Missing Skills</p>
              {missingSkills.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-orange-50 px-3 py-2 text-sm font-medium text-clay">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No missing skills were detected.</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card min-w-0 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine/10 text-pine">
              <ScanSearch className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Score overview</h2>
              <p className="text-slate-600">Quick comparison of ATS readiness and job relevance.</p>
            </div>
          </div>

          <div className="mt-8 h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={280} debounce={200}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                  {scoreData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-5 w-5 text-clay" />
            <h2 className="font-display text-2xl font-bold">Missing Keywords</h2>
          </div>
          {missingKeywords.length ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {missingKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-clay">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-slate-500">No missing keywords were identified.</p>
          )}
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-5 w-5 text-clay" />
            <h2 className="font-display text-2xl font-bold">Resume Issues</h2>
          </div>
          {issues.length ? (
            <ul className="mt-5 space-y-3 text-slate-700">
              {issues.map((issue) => (
                <li key={issue} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-slate-500">No major resume issues were reported.</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-olive" />
            <h2 className="font-display text-2xl font-bold">Suggestions for Improvement</h2>
          </div>
          {suggestions.length ? (
            <ul className="mt-5 space-y-3 text-slate-700">
              {suggestions.map((suggestion) => (
                <li key={suggestion} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {suggestion}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-slate-500">No improvement suggestions were returned.</p>
          )}

          <div className="mt-8 rounded-3xl bg-ink p-6 text-white">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-display text-xl font-bold">Improved Summary Rewrite</h3>
            </div>
            <p className="mt-4 leading-8 text-white/85">
              {analysis.improved_summary || 'No summary rewrite was returned for this resume.'}
            </p>
          </div>
        </div>

        <div className="glass-card min-w-0 p-8">
          <h2 className="font-display text-2xl font-bold">Section Analysis</h2>
          <p className="mt-2 text-slate-600">Section-wise strengths and fixes based on ATS fit.</p>

          {sectionChartData.length ? (
            <div className="mt-6 h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={280} debounce={200}>
                <BarChart layout="vertical" data={sectionChartData} margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={90} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0f766e" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-slate-50 px-5 py-8 text-slate-500">
              Section-level chart data is not available for this result.
            </div>
          )}
        </div>
      </div>

      {sectionAnalysis.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sectionAnalysis.map((section) => (
            <div key={section.section} className="glass-card p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-bold">{section.section}</h3>
                <span className="rounded-full bg-mist px-3 py-2 text-sm font-semibold text-pine">{section.score}/100</span>
              </div>
              <p className="mt-4 leading-7 text-slate-600">{section.feedback}</p>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Strengths</p>
                {section.strengths?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {section.strengths.map((item) => (
                      <span key={item} className="rounded-full bg-mist px-3 py-2 text-sm font-medium text-pine">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No section strengths were returned.</p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Improvements</p>
                {section.improvements?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {section.improvements.map((item) => (
                      <span key={item} className="rounded-full bg-orange-50 px-3 py-2 text-sm font-medium text-clay">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No section improvements were returned.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onDeleteResult}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete Result
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Improve Resume
        </button>
      </div>
    </section>
  )
}

export default ResultDashboard
