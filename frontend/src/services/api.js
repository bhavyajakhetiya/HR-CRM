import axios from 'axios'

const baseEnvUrl = import.meta.env.VITE_API_URL;
const resolvedBaseUrl = baseEnvUrl 
  ? (baseEnvUrl.endsWith('/api') ? baseEnvUrl : `${baseEnvUrl}/api`)
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor — attach JWT token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrcrm_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 globally ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hrcrm_token')
      localStorage.removeItem('hrcrm_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
