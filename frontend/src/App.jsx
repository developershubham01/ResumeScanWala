import { lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import BackToTopButton from './components/BackToTopButton'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import { AnalysisProvider } from './context/AnalysisContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))

function App() {
  return (
    <HelmetProvider>
      <AnalysisProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-sand text-ink">
            <ScrollToTop />
            <Header />
            <main>
              <Suspense fallback={<div className="section-shell py-24 text-center text-slate-600">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/results" element={<ResultsPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <BackToTopButton />
          </div>
        </BrowserRouter>
      </AnalysisProvider>
    </HelmetProvider>
  )
}

export default App
