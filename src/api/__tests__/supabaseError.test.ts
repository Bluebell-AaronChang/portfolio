import { describe, it, expect } from 'vitest'
import { toAppError } from '@/api/supabaseError'

describe('toAppError', () => {
  it('should convert a Supabase PostgREST error to AppError', () => {
    const error = {
      code: '42P01',
      message: 'relation "nonexistent" does not exist',
      hint: 'Check the table name',
      details: 'Some details',
    }

    const result = toAppError(error)

    expect(result).toEqual({
      code: '42P01',
      message: 'relation "nonexistent" does not exist',
      hint: 'Check the table name',
      details: 'Some details',
      type: 'business',
    })
  })

  it('should handle error without optional fields', () => {
    const error = {
      code: '23505',
      message: 'duplicate key value violates unique constraint',
    }

    const result = toAppError(error)

    expect(result.code).toBe('23505')
    expect(result.message).toBe('duplicate key value violates unique constraint')
    expect(result.type).toBe('business')
    expect(result.hint).toBeUndefined()
    expect(result.details).toBeUndefined()
  })

  it('should always set type to business', () => {
    const error = { code: '401', message: 'Unauthorized' }
    const result = toAppError(error)
    expect(result.type).toBe('business')
  })
})
