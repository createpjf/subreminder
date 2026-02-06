export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time'

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'trial'

export interface Subscription {
  id: string
  name: string
  url: string | null
  logo: string | null
  amount: number
  currency: string
  cycle: BillingCycle
  billingDay: number
  startDate: string
  trialEndDate: string | null
  category: string
  status: SubscriptionStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type SubscriptionFormData = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
