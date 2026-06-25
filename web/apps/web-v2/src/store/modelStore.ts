import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModelAsset } from '@/types'
import { SEED_MODELS } from '@/lib/seed'
import { uid } from '@/lib/utils'

interface ModelState {
  models: ModelAsset[]
  add: (m: Omit<ModelAsset, 'id' | 'createdAt'>) => void
  update: (id: string, patch: Partial<ModelAsset>) => void
  remove: (id: string) => void
}

export const useModelStore = create<ModelState>()(
  persist(
    (set) => ({
      models: SEED_MODELS,
      add: (m) => set((s) => ({ models: [{ ...m, id: uid('m'), createdAt: new Date().toISOString() }, ...s.models] })),
      update: (id, patch) => set((s) => ({ models: s.models.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
      remove: (id) => set((s) => ({ models: s.models.filter((it) => it.id !== id) })),
    }),
    { name: '1stream.models' }
  )
)
