import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SubCard from '../SubCard'
import type { Subscription } from '@/shared/types'

const mockSub: Subscription = {
  id: 'test-1',
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
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
}

describe('SubCard', () => {
  it('renders subscription name', () => {
    render(<SubCard subscription={mockSub} onClick={() => {}} />)
    expect(screen.getByText('Netflix')).toBeInTheDocument()
  })

  it('renders formatted amount', () => {
    render(<SubCard subscription={mockSub} onClick={() => {}} />)
    expect(screen.getByText('$15.99')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(<SubCard subscription={mockSub} onClick={() => {}} />)
    expect(screen.getByText('Streaming')).toBeInTheDocument()
  })

  it('renders cycle label', () => {
    render(<SubCard subscription={mockSub} onClick={() => {}} />)
    expect(screen.getByText('/mo')).toBeInTheDocument()
  })

  it('renders one-time label for one-time sub', () => {
    const oneTimeSub = { ...mockSub, cycle: 'one-time' as const }
    render(<SubCard subscription={oneTimeSub} onClick={() => {}} />)
    expect(screen.getByText('one-time')).toBeInTheDocument()
  })

  it('shows fallback initial when no logo', () => {
    const noUrlSub = { ...mockSub, url: null }
    render(<SubCard subscription={noUrlSub} onClick={() => {}} />)
    expect(screen.getByText('N')).toBeInTheDocument()
  })
})
