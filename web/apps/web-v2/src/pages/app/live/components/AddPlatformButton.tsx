import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { usePlatformStore } from '@/store/platformStore'
import { PLATFORM_META } from '@/types'
import type { PlatformId } from '@/types'

const ALL_PLATFORM_IDS = Object.keys(PLATFORM_META) as PlatformId[]

export function AddPlatformButton() {
  const { platforms, connect } = usePlatformStore()
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<PlatformId | ''>('')
  const [accountName, setAccountName] = useState('')
  const available = ALL_PLATFORM_IDS.filter((id) => !platforms.some((p) => p.id === id))

  const close = () => {
    setOpen(false)
    setSelectedId('')
    setAccountName('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-card px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary hover:border-primary transition cursor-pointer shrink-0"
      >
        <Plus className="h-3 w-3" /> Thêm
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={close}>
          <div
            className="w-full max-w-sm rounded-xl bg-card border border-border shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Thêm nền tảng</h3>
              <button type="button" onClick={close} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="block mb-3">
              <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">Nền tảng</span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value as PlatformId | '')}
                className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="">Chọn nền tảng</option>
                {available.map((id) => (
                  <option key={id} value={id}>{PLATFORM_META[id].name}</option>
                ))}
              </select>
            </label>

            <label className="block mb-5">
              <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">Tên tài khoản</span>
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="@your_account"
                className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none focus:border-primary/50 placeholder-muted-foreground"
              />
            </label>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={close}
                className="h-9 rounded-lg border border-border bg-secondary px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!selectedId}
                onClick={() => {
                  if (selectedId) {
                    connect(selectedId, accountName || '@demo')
                    close()
                  }
                }}
                className="h-9 rounded-lg bg-primary px-4 text-xs font-bold text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Kết nối
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
