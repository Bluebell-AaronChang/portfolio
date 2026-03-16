import { describe, it, expect } from 'vitest'
import { parseError } from '@/lib/parseError'
import type { AppError } from '@/types/error'

describe('parseError', () => {
  it('should return cancelled for AbortError DOMException', () => {
    const err = new DOMException('The operation was aborted.', 'AbortError')
    const result = parseError(err)
    expect(result).toEqual<AppError>({
      code: 'CANCELLED',
      message: 'Request cancelled',
      type: 'cancelled',
    })
  })

  it('should return cancelled for CanceledError', () => {
    const err = new Error('canceled')
    err.name = 'CanceledError'
    const result = parseError(err)
    expect(result.type).toBe('cancelled')
  })

  it('should return cancelled for ERR_CANCELED code', () => {
    const err = { response: undefined, code: 'ERR_CANCELED', message: 'canceled' }
    const result = parseError(err)
    expect(result.type).toBe('cancelled')
  })

  it('should pass through AppError with existing type', () => {
    const err: AppError = {
      code: '401',
      message: 'Unauthorized',
      type: 'auth',
    }
    const result = parseError(err)
    expect(result).toEqual(err)
  })

  it('should detect auth errors from Supabase code 401', () => {
    const err = { code: '401', message: 'Unauthorized' }
    const result = parseError(err)
    expect(result.type).toBe('auth')
  })

  it('should detect auth errors from invalid_credentials code', () => {
    const err = { code: 'invalid_credentials', message: 'Invalid login credentials' }
    const result = parseError(err)
    expect(result.type).toBe('auth')
  })

  it('should detect validation errors from PostgreSQL code 23xxx', () => {
    const err = { code: '23505', message: 'duplicate key value' }
    const result = parseError(err)
    expect(result.type).toBe('validation')
  })

  it('should detect validation errors from PGRST116', () => {
    const err = { code: 'PGRST116', message: 'not found' }
    const result = parseError(err)
    expect(result.type).toBe('validation')
  })

  it('should classify generic Supabase errors as business', () => {
    const err = { code: '42P01', message: 'relation does not exist', hint: 'Check table name' }
    const result = parseError(err)
    expect(result.type).toBe('business')
    expect(result.hint).toBe('Check table name')
  })

  it('should parse Axios-like errors with response status', () => {
    const err = {
      response: { status: 422, data: { message: 'Validation failed' } },
      message: 'Request failed',
    }
    const result = parseError(err)
    expect(result.type).toBe('validation')
    expect(result.message).toBe('Validation failed')
    expect(result.code).toBe('422')
  })

  it('should parse Axios-like errors with 500 status as business', () => {
    const err = {
      response: { status: 500, data: { message: 'Internal server error' } },
      message: 'Request failed',
    }
    const result = parseError(err)
    expect(result.type).toBe('business')
  })

  it('should parse Axios-like network errors (no response)', () => {
    const err = {
      response: undefined,
      message: 'Network Error',
    }
    const result = parseError(err)
    expect(result.type).toBe('network')
    expect(result.code).toBe('NETWORK_ERROR')
  })

  it('should handle plain Error instances', () => {
    const err = new Error('Something went wrong')
    const result = parseError(err)
    expect(result).toEqual<AppError>({
      code: 'UNKNOWN',
      message: 'Something went wrong',
      type: 'business',
    })
  })

  it('should handle unknown error types', () => {
    const result = parseError('string error')
    expect(result).toEqual<AppError>({
      code: 'UNKNOWN',
      message: '發生未知錯誤',
      type: 'business',
    })
  })

  it('should handle null error', () => {
    const result = parseError(null)
    expect(result).toEqual<AppError>({
      code: 'UNKNOWN',
      message: '發生未知錯誤',
      type: 'business',
    })
  })
})
