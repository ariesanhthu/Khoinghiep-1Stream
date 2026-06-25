import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
  login: (value: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (value: string) => {
        const email = value.includes('@') ? value : `${value || 'user'}@1stream.ai`
        const name = value.split('@')[0] || 'Người dùng'
        set({ user: { name, email }, isAuthenticated: true })
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: '1stream.auth' }
  )
)
