import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Voice } from '@/types'
import { SEED_VOICES } from '@/lib/seed'
import { uid } from '@/lib/utils'

interface VoiceState {
  voices: Voice[]
  add: (v: Omit<Voice, 'id' | 'createdAt'>) => void
  update: (id: string, patch: Partial<Voice>) => void
  remove: (id: string) => void
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      voices: SEED_VOICES,
      add: (v) => set((s) => ({ voices: [{ ...v, id: uid('v'), createdAt: new Date().toISOString() }, ...s.voices] })),
      update: (id, patch) => set((s) => ({ voices: s.voices.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
      remove: (id) => set((s) => ({ voices: s.voices.filter((it) => it.id !== id) })),
    }),
    { name: '1stream.voices' }
  )
)
