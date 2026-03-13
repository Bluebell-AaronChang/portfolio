import type { AppError } from '@/types/error'

interface SupabaseError {
    code: string
    message: string
    hint?: string
    details?: string
}

interface AxiosLikeError {
    response?: { status: number; data?: { message?: string } }
    message?: string
    code?: string
}

function isSupabaseError(err: unknown): err is SupabaseError {
    return (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        'message' in err &&
        typeof (err as SupabaseError).code === 'string'
    )
}

function isAxiosError(err: unknown): err is AxiosLikeError {
    return typeof err === 'object' && err !== null && 'response' in err
}

function isCancelledError(err: unknown): boolean {
    if (err instanceof DOMException && err.name === 'AbortError') return true
    if (err instanceof Error && err.name === 'CanceledError') return true
    if (
        typeof err === 'object' &&
        err !== null &&
        (err as AxiosLikeError).code === 'ERR_CANCELED'
    )
        return true
    return false
}


export function parseError(err: unknown): AppError {
    if (isCancelledError(err)) {
        return { code: 'CANCELLED', message: 'Request cancelled', type: 'cancelled' }
    }

    if (isSupabaseError(err) && (err as AppError).type) {
        return err as AppError
    }

    if (isSupabaseError(err)) {
        const code = err.code
        const isAuth = code === '401' || code === 'invalid_credentials' || code === 'not_admin'
        const isValidation = code.startsWith('22') || code.startsWith('23') || code === 'PGRST116'
        return {
            code,
            message: err.message,
            hint: err.hint,
            details: err.details,
            type: isAuth ? 'auth' : isValidation ? 'validation' : 'business',
        }
    }

    if (isAxiosError(err)) {
        const status = err.response?.status ?? 0
        const message = err.response?.data?.message ?? (err as Error).message ?? '發生未知錯誤'
        return {
            code: status ? String(status) : 'NETWORK_ERROR',
            message,
            type: !err.response ? 'network' : status >= 400 && status < 500 ? 'validation' : 'business',
        }
    }

    if (err instanceof Error) {
        return { code: 'UNKNOWN', message: err.message, type: 'business' }
    }

    return { code: 'UNKNOWN', message: '發生未知錯誤', type: 'business' }
}
