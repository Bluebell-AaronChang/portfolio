import type { AppError } from '@/types/error'

interface SupabasePostgrestError {
  code: string
  message: string
  hint?: string
  details?: string
}

/**
 * Convert a Supabase PostgREST error to an AppError.
 * Intended to be used in service layers: `if (error) throw toAppError(error)`
 */
export function toAppError(error: SupabasePostgrestError): AppError {
  return {
    code: error.code,
    message: error.message,
    hint: error.hint,
    details: error.details,
    type: 'business',
  }
}
