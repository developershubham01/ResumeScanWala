import { siteConfig } from '../siteConfig'
import jsPDF from 'jspdf'

import { formatDate } from './helpers'

function addWrappedText(doc, text, x, y, width, lineHeight = 7) {
  const lines = doc.splitTextToSize(text, width)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function addBulletList(doc, title, items, x, y, width) {
  doc.setFont('helvetica', 'bold')
  doc.text(title, x, y)
  doc.setFont('helvetica', 'normal')

  let currentY = y + 7
  items.forEach((item) => {
    currentY = addWrappedText(doc, `• ${item}`, x + 2, currentY, width - 2)
    currentY += 2
  })

  return currentY
}

export function downloadAnalysisPdf(result) {
  const doc = new jsPDF()
  const { analysis } = result
  const pageWidth = 180
  let y = 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(`${siteConfig.appName} Report`, 15, y)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  y += 8
  doc.text(`File: ${result.file_name}`, 15, y)
  y += 6
  doc.text(`Generated: ${formatDate(result.created_at)}`, 15, y)

  y += 12
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(`ATS Score: ${analysis.ats_score}/100`, 15, y)
  y += 6
  doc.text(`Job Match: ${analysis.jd_match_percentage}%`, 15, y)

  y += 12
  doc.setFont('helvetica', 'normal')
  y = addBulletList(doc, 'Missing Keywords', analysis.missing_keywords, 15, y, pageWidth)
  y += 4
  y = addBulletList(doc, 'Resume Issues', analysis.issues, 15, y, pageWidth)
  y += 4
  y = addBulletList(doc, 'Suggestions', analysis.suggestions, 15, y, pageWidth)

  if (y > 230) {
    doc.addPage()
    y = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Improved Summary', 15, y)
  doc.setFont('helvetica', 'normal')
  y = addWrappedText(doc, analysis.improved_summary, 15, y + 7, pageWidth)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Section Feedback', 15, y)
  doc.setFont('helvetica', 'normal')
  y += 7

  analysis.section_analysis.forEach((section) => {
    if (y > 245) {
      doc.addPage()
      y = 20
    }

    doc.setFont('helvetica', 'bold')
    doc.text(`${section.section} (${section.score}/100)`, 15, y)
    doc.setFont('helvetica', 'normal')
    y = addWrappedText(doc, section.feedback, 15, y + 6, pageWidth)
    y += 4
  })

  doc.save('resumescanwala-report.pdf')
}
