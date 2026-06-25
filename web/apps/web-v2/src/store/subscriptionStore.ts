import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan, PlanId, Subscription } from '@/types'
import { SEED_PLANS } from '@/lib/seed'

interface SubscriptionState {
  plans: Plan[]
  subscription: Subscription | null
  startTrial: (planId: PlanId) => void
  switchPlan: (planId: PlanId) => void
  trialDaysLeft: () => number
  currentPlan: () => Plan | null
  incrementVideoUsage: () => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: SEED_PLANS,
      subscription: { planId: 'pro', trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), videosUsed: 0 },
      startTrial: (planId) => {
        const ends = new Date()
        ends.setDate(ends.getDate() + 7)
        set({ subscription: { planId, trialEndsAt: ends.toISOString(), videosUsed: 0 } })
      },
      switchPlan: (planId) => {
        const sub = get().subscription
        if (!sub) {
          get().startTrial(planId)
          return
        }
        set({ subscription: { ...sub, planId } })
      },
      trialDaysLeft: () => {
        const sub = get().subscription
        if (!sub) return 0
        const diff = new Date(sub.trialEndsAt).getTime() - Date.now()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
      },
      currentPlan: () => {
        const sub = get().subscription
        if (!sub) return null
        return get().plans.find((p) => p.id === sub.planId) ?? null
      },
      incrementVideoUsage: () => {
        const sub = get().subscription
        if (!sub) return
        set({ subscription: { ...sub, videosUsed: sub.videosUsed + 1 } })
      },
    }),
    { name: '1stream.subscription' }
  )
)
