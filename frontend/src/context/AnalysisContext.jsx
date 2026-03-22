import { createContext, useEffect, useState } from 'react'

import { analyzeResumeRequest } from '../utils/api'

const STORAGE_KEY = 'resume-analyzer:last-analysis'
const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedResult = localStorage.getItem(STORAGE_KEY)
    if (storedResult) {
      try {
        setAnalysisResult(JSON.parse(storedResult))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const analyzeResume = async ({ file, jobDescription }) => {
    setIsAnalyzing(true)
    setError('')

    try {
      const response = await analyzeResumeRequest({ file, jobDescription })
      setAnalysisResult(response)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response))
      return response
    } catch (requestError) {
      const detail =
        requestError.response?.data?.detail ||
        requestError.message ||
        'Analysis failed. Please try again.'
      setError(detail)
      throw new Error(detail)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setError('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AnalysisContext.Provider
      value={{
        analysisResult,
        analyzeResume,
        error,
        isAnalyzing,
        resetAnalysis,
        setError,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export { AnalysisContext }
