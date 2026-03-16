import { describe, it, expect, beforeEach } from 'vitest'
import { track, untrack, abortAll, abortKey, getTrackedCount } from '@/lib/abortManager'

describe('abortManager', () => {
  beforeEach(() => {
    abortAll()
  })

  it('should track and count controllers', () => {
    const c1 = new AbortController()
    const c2 = new AbortController()
    track(c1)
    track(c2)
    expect(getTrackedCount()).toBe(2)
  })

  it('should untrack a controller', () => {
    const c1 = new AbortController()
    track(c1)
    expect(getTrackedCount()).toBe(1)
    untrack(c1)
    expect(getTrackedCount()).toBe(0)
  })

  it('should abort all controllers', () => {
    const c1 = new AbortController()
    const c2 = new AbortController()
    track(c1)
    track(c2)
    abortAll()
    expect(c1.signal.aborted).toBe(true)
    expect(c2.signal.aborted).toBe(true)
    expect(getTrackedCount()).toBe(0)
  })

  it('should abort controllers by key', () => {
    const c1 = new AbortController()
    const c2 = new AbortController()
    const c3 = new AbortController()
    track(c1, '/api/posts')
    track(c2, '/api/posts')
    track(c3, '/api/projects')

    abortKey('/api/posts')

    expect(c1.signal.aborted).toBe(true)
    expect(c2.signal.aborted).toBe(true)
    expect(c3.signal.aborted).toBe(false)
  })

  it('should handle abortKey with nonexistent key', () => {
    expect(() => abortKey('/nonexistent')).not.toThrow()
  })
})
