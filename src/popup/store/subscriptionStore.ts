import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { chromeStorage } from '@/shared/storage'
import { generateId } from '@/shared/utils'
import type { Subscription, SubscriptionFormData } from '@/shared/types'

interface SubscriptionState {
  subscriptions: Subscription[]
  addSubscription: (data: SubscriptionFormData) => void
  updateSubscription: (id: string, data: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
  togglePause: (id: string) => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscriptions: [],

      addSubscription: (data) => {
        const now = new Date().toISOString()
        const newSub: Subscription = {
          ...data,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          subscriptions: [...state.subscriptions, newSub],
        }))
      },

      updateSubscription: (id, data) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id
              ? { ...sub, ...data, updatedAt: new Date().toISOString() }
              : sub
          ),
        }))
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }))
      },

      togglePause: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id
              ? {
                  ...sub,
                  status: sub.status === 'paused' ? 'active' : 'paused',
                  updatedAt: new Date().toISOString(),
                }
              : sub
          ),
        }))
      },
    }),
    {
      name: 'subtracker-subscriptions',
      storage: createJSONStorage(() => chromeStorage),
    }
  )
)
