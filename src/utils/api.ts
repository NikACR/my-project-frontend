import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens
} from './tokenStorage'

const api = axios.create({
  baseURL: '/api',        // <-- všechny volání api.post('/auth/…') jdou na /api/auth/…
})

api.interceptors.request.use(cfg => {
  const t = getAccessToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

let isRefreshing = false
let failedQueue: { resolve: (token?: string) => void; reject: (err: any) => void }[] = []

const processQueue = (err: any, token: string | null = null) => {
  failedQueue.forEach(p => err ? p.reject(err) : p.resolve(token!))
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  err => {
    const originalReq = err.config
    if (err.response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalReq.headers.Authorization = `Bearer ${token}`
          return api.request(originalReq)
        })
      }

      originalReq._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        return Promise.reject(err)
      }

      return new Promise(async (resolve, reject) => {
        try {
          // teď už voláme přes naši instanci api, ne axios
          const r = await api.post<{ access_token: string }>(
            '/auth/refresh',
            {}, 
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          )
          const newToken = r.data.access_token
          setAccessToken(newToken)
          api.defaults.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
          originalReq.headers.Authorization = `Bearer ${newToken}`
          resolve(api.request(originalReq))
        } catch (e) {
          processQueue(e, null)
          clearTokens()
          reject(e)
        } finally {
          isRefreshing = false
        }
      })
    }
    return Promise.reject(err)
  }
)

export default api
