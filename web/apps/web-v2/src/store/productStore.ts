import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'
import { SEED_PRODUCTS } from '@/lib/seed'
import { uid } from '@/lib/utils'

interface ProductState {
  products: Product[]
  add: (p: Omit<Product, 'id' | 'createdAt'>) => void
  update: (id: string, patch: Partial<Product>) => void
  remove: (id: string) => void
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: SEED_PRODUCTS,
      add: (p) =>
        set((s) => ({ products: [{ ...p, id: uid('p'), createdAt: new Date().toISOString() }, ...s.products] })),
      update: (id, patch) =>
        set((s) => ({ products: s.products.map((it) => (it.id === id ? { ...it, ...patch } : it)) })),
      remove: (id) => set((s) => ({ products: s.products.filter((it) => it.id !== id) })),
    }),
    { name: '1stream.products.education' }
  )
)
