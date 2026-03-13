import { onBeforeRouteLeave } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import { abortAll, abortKey } from '@/lib/abortManager'

export function useRouteQueryCancel(options?: {
    queryKey?: readonly unknown[]
    axiosKey?: string
}) {
    const queryClient = useQueryClient()

    onBeforeRouteLeave(() => {
        if (options?.queryKey) {
            queryClient.cancelQueries({ queryKey: options.queryKey })
        } else {
            queryClient.cancelQueries()
        }

        if (options?.axiosKey) {
            abortKey(options.axiosKey)
        } else {
            abortAll()
        }
    })
}
