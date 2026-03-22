export function formatDate(value) {
  return new Date(value).toLocaleString()
}

export function clampScore(value) {
  return Math.min(100, Math.max(0, Number(value) || 0))
}

export function buildSectionChartData(sectionAnalysis = []) {
  return sectionAnalysis.map((section) => ({
    name: section.section,
    score: clampScore(section.score),
  }))
}
