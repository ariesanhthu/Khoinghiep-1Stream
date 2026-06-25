import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Platform, PlatformId } from '@/types'
import { SEED_PLATFORMS } from '@/lib/seed'

interface PlatformState {
  platforms: Platform[]
  connect: (id: PlatformId, account: string) => void
  disconnect: (id: PlatformId) => void
  connectedPlatforms: () => Platform[]
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      platforms: SEED_PLATFORMS,
      connect: (id, account) =>
        set((s) => ({
          platforms: s.platforms.map((p) =>
            p.id === id ? { ...p, connected: true, account, connectedAt: new Date().toISOString() } : p
          ),
        })),
      disconnect: (id) =>
        set((s) => ({
          platforms: s.platforms.map((p) =>
            p.id === id ? { ...p, connected: false, account: undefined, connectedAt: undefined } : p
          ),
        })),
      connectedPlatforms: () => get().platforms.filter((p) => p.connected),
    }),
    { name: '1stream.platforms' }
  )
)
