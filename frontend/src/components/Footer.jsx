import { Github, Heart, Linkedin, Mail, Send } from 'lucide-react'
import { useState } from 'react'

import { siteConfig } from '../siteConfig'
import { subscribeRequest } from '../utils/api'

function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setMessage('Enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await subscribeRequest({ email: normalizedEmail })
      setMessage(response.message)
      if (response.is_new_subscription) {
        setEmail('')
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Subscription failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-white/60 bg-[#fffaf5]">
      <div className="section-shell py-12">
        <div className="grid gap-8 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur lg:grid-cols-[0.9fr_0.55fr_0.75fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pine">{siteConfig.appName}</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink">Build better resumes for every role.</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-600">
              AI-powered resume analysis with ATS score, job match, section feedback, and clean recommendations you can
              use immediately.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Connect</p>
            <div className="mt-5 space-y-3">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">GitHub</span>
              </a>
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <Linkedin className="h-5 w-5" />
                <span className="font-medium">LinkedIn</span>
              </a>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">{siteConfig.contactEmail}</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Subscribe</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Get notified about UI updates, new resume tools, and product improvements.
            </p>
            <form onSubmit={handleSubscribe} className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
            {message && <p className="mt-3 text-sm text-pine">{message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Built with React, Tailwind CSS, FastAPI, MySQL, and Google Gemini.</p>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-slate-700"
          >
            <span>Developed with</span>
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>by</span>
            <span className="font-semibold text-amber-700 transition hover:text-teal-700">Shubham Sharma</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
