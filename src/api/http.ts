import axios from 'axios'
import { track, untrack } from '@/lib/abortManager'
import { parseError } from '@/lib/parseError'

const http = axios.create({
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const controller = new AbortController()
    ; (controller.signal as AbortSignal & { _controller: AbortController })._controller = controller

  config.signal = controller.signal

  const key = config.url?.split('?')[0]
  track(controller, key)

  return config
})

http.interceptors.response.use(
  (response) => {
    const signal = response.config.signal as (AbortSignal & { _controller?: AbortController }) | undefined
    if (signal?._controller) untrack(signal._controller)
    return response
  },
  (error) => {
    const signal = error.config?.signal as (AbortSignal & { _controller?: AbortController }) | undefined
    if (signal?._controller) untrack(signal._controller)

    return Promise.reject(parseError(error))
  },
)

export default http
