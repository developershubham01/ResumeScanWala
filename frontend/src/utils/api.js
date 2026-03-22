import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 120000,
})

export async function analyzeResumeRequest({ file, jobDescription }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('job_description', jobDescription)

  const { data } = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export async function subscribeRequest({ email }) {
  const { data } = await api.post('/subscribe', { email })
  return data
}

export default api
