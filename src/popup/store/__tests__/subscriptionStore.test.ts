import { describe, it, expect, beforeEach } from 'vitest'
import { useSubscriptionStore } from '../subscriptionStore'
import type { SubscriptionFormData } from '@/shared/types'

const mockFormData: SubscriptionFormData = {
  name: 'Netflix',
  url: 'https://netflix.com',
  logo: null,
  amount: 15.99,
  currency: 'USD',
  cycle: 'monthly',
  billingDay: 15,
  startDate: '2025-01-15',
  trialEndDate: null,
  category: 'Streaming',
  status: 'active',
  notes: null,
}

describe('subscriptionStore', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({ subscriptions: [] })
  })

  it('starts with empty subscriptions', () => {
    expect(useSubscriptionStore.getState().subscriptions).toEqual([])
  })

  it('adds a subscription', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    const subs = useSubscriptionStore.getState().subscriptions
    expect(subs).toHaveLength(1)
    expect(subs[0].name).toBe('Netflix')
    expect(subs[0].amount).toBe(15.99)
    expect(subs[0].id).toBeTruthy()
    expect(subs[0].createdAt).toBeTruthy()
    expect(subs[0].updatedAt).toBeTruthy()
  })

  it('updates a subscription', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    const id = useSubscriptionStore.getState().subscriptions[0].id

    useSubscriptionStore.getState().updateSubscription(id, { amount: 19.99 })
    const updated = useSubscriptionStore.getState().subscriptions[0]
    expect(updated.amount).toBe(19.99)
    expect(updated.name).toBe('Netflix') // unchanged fields preserved
  })

  it('deletes a subscription', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    const id = useSubscriptionStore.getState().subscriptions[0].id

    useSubscriptionStore.getState().deleteSubscription(id)
    expect(useSubscriptionStore.getState().subscriptions).toHaveLength(0)
  })

  it('toggles pause', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    const id = useSubscriptionStore.getState().subscriptions[0].id

    useSubscriptionStore.getState().togglePause(id)
    expect(useSubscriptionStore.getState().subscriptions[0].status).toBe('paused')

    useSubscriptionStore.getState().togglePause(id)
    expect(useSubscriptionStore.getState().subscriptions[0].status).toBe('active')
  })

  it('handles multiple subscriptions', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    useSubscriptionStore.getState().addSubscription({ ...mockFormData, name: 'Spotify', amount: 9.99 })

    const subs = useSubscriptionStore.getState().subscriptions
    expect(subs).toHaveLength(2)
    expect(subs[0].name).toBe('Netflix')
    expect(subs[1].name).toBe('Spotify')
  })

  it('does not affect other subs on update', () => {
    useSubscriptionStore.getState().addSubscription(mockFormData)
    useSubscriptionStore.getState().addSubscription({ ...mockFormData, name: 'Spotify', amount: 9.99 })

    const netflixId = useSubscriptionStore.getState().subscriptions[0].id
    useSubscriptionStore.getState().updateSubscription(netflixId, { amount: 22.99 })

    const subs = useSubscriptionStore.getState().subscriptions
    expect(subs[0].amount).toBe(22.99)
    expect(subs[1].amount).toBe(9.99)
  })
})
