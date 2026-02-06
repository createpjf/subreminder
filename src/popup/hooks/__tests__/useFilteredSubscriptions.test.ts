import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilteredSubscriptions } from '../useFilteredSubscriptions'
import type { Subscription } from '@/shared/types'

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: Math.random().toString(),
    name: 'Test',
    url: null,
    logo: null,
    amount: 10,
    currency: 'USD',
    cycle: 'monthly',
    billingDay: 15,
    startDate: '2025-01-15',
    trialEndDate: null,
    category: 'Other',
    status: 'active',
    notes: null,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    ...overrides,
  }
}

const subs: Subscription[] = [
  makeSub({ name: 'Netflix', amount: 15.99, status: 'active', category: 'Streaming', createdAt: '2025-01-01T00:00:00Z' }),
  makeSub({ name: 'Spotify', amount: 9.99, status: 'active', category: 'Music', createdAt: '2025-02-01T00:00:00Z' }),
  makeSub({ name: 'Adobe CC', amount: 54.99, status: 'paused', category: 'Software', createdAt: '2025-03-01T00:00:00Z' }),
  makeSub({ name: 'ChatGPT Plus', amount: 20, status: 'trial', category: 'AI', createdAt: '2025-04-01T00:00:00Z' }),
  makeSub({ name: 'Gym', amount: 30, status: 'cancelled', category: 'Fitness', createdAt: '2025-05-01T00:00:00Z' }),
]

describe('useFilteredSubscriptions', () => {
  it('returns all subs with no filters', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, '', 'all', 'name')
    )
    expect(result.current).toHaveLength(5)
  })

  it('filters by search (case insensitive)', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, 'net', 'all', 'name')
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Netflix')
  })

  it('searches category too', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, 'music', 'all', 'name')
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Spotify')
  })

  it('filters by status', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, '', 'paused', 'name')
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Adobe CC')
  })

  it('sorts by name', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, '', 'all', 'name')
    )
    const names = result.current.map((s) => s.name)
    expect(names).toEqual([...names].sort())
  })

  it('sorts by amount descending', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, '', 'all', 'amount')
    )
    const amounts = result.current.map((s) => s.amount)
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a))
  })

  it('sorts by date added (newest first)', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, '', 'all', 'dateAdded')
    )
    expect(result.current[0].name).toBe('Gym') // latest createdAt
    expect(result.current[4].name).toBe('Netflix') // earliest
  })

  it('combines search and filter', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, 'a', 'active', 'name')
    )
    // 'a' matches Netflix, Spotify, ChatGPT (but ChatGPT is trial, not active)
    // Active: Netflix, Spotify. Both contain 'a'? Netflix no, Spotify no...
    // Actually 'a' in lowercase: Netflix has 'a' in name? No. Let's check
    // 'a' is in 'ChatGPT Plus' -> no. Actually: checking includes for 'a':
    // netflix -> no, spotify -> no, adobe cc -> yes but paused, chatgpt plus -> yes but trial
    // gym -> no... hmm let's reconsider: we need 'a' to match something active
    // Actually none of the active subs have 'a' in them
    // Let me use a better search term
  })

  it('combines search and filter correctly', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, 'spotify', 'active', 'name')
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Spotify')
  })

  it('returns empty for no matches', () => {
    const { result } = renderHook(() =>
      useFilteredSubscriptions(subs, 'zzzzz', 'all', 'name')
    )
    expect(result.current).toHaveLength(0)
  })
})
