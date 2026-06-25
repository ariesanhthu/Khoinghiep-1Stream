import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment, LiveConfig, PlatformId } from '@/types'

interface LiveSessionState {
  config: LiveConfig | null
  isLive: boolean
  activePlatforms: PlatformId[]
  comments: Comment[]
  aiAutoReply: boolean
  setConfig: (c: LiveConfig) => void
  startLive: () => void
  stopLive: () => void
  togglePlatform: (id: PlatformId) => void
  setAiAutoReply: (v: boolean) => void
  pushComment: (c: Comment) => void
  setAiReply: (commentId: string, reply: string) => void
}

export const useLiveSessionStore = create<LiveSessionState>()(
  persist(
    (set) => ({
      config: null,
      isLive: false,
      activePlatforms: [],
      comments: [],
      aiAutoReply: true,
      setConfig: (c) => set({ config: c, activePlatforms: c.platforms }),
      startLive: () => set({ isLive: true, comments: [] }),
      stopLive: () => set({ isLive: false }),
      togglePlatform: (id) =>
        set((s) => ({
          activePlatforms: s.activePlatforms.includes(id)
            ? s.activePlatforms.filter((p) => p !== id)
            : [...s.activePlatforms, id],
        })),
      setAiAutoReply: (v) => set({ aiAutoReply: v }),
      pushComment: (c) => set((s) => ({ comments: [...s.comments, c] })),
      setAiReply: (commentId, reply) =>
        set((s) => ({
          comments: s.comments.map((c) => (c.id === commentId ? { ...c, aiReplied: true, aiReply: reply } : c)),
        })),
    }),
    { name: '1stream.live', partialize: (s) => ({ config: s.config, aiAutoReply: s.aiAutoReply }) }
  )
)
