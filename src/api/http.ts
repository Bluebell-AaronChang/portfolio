import axios from 'axios'
import type { AppError } from '@/types/error'

const http = axios.create({
  timeout: 15000,
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError: AppError = {
      code: error.response?.status?.toString() ?? 'NETWORK_ERROR',
      message: error.response?.data?.message ?? error.message ?? '發生未知錯誤',
      type: !error.response
        ? 'network'
        : error.response.status >= 400 && error.response.status < 500
          ? 'validation'
          : 'business',
    }
    return Promise.reject(appError)
  },
)

export default http
