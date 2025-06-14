import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig
} from 'axios';
const domainBase:string = import.meta.env.VITE_API_DOMAINBASE
const urlBase:string = import.meta.env.VITE_API_URLBASE
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useToken?: boolean
  _retry?: boolean  
}

const api = axios.create({
  baseURL: `${domainBase}${urlBase}`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token Helpers
const getAccessToken = () => localStorage.getItem('access_token')
const getRefreshToken = () => localStorage.getItem('refresh_token')
const setAccessToken = (token: string) => localStorage.setItem('access_token', token)
const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// Interceptor: Add token to header
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const useToken = config.useToken !== false
    if (useToken) {
      const token = getAccessToken()
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Token refresh queue
let isRefreshing:Boolean = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// Interceptor: Handle response 401 and refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${domainBase}/refresh`,
          { refresh_token: getRefreshToken() }
        )

        const newToken = res.data.access_token
        setAccessToken(newToken)

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
