import { useRef, useEffect } from 'react'
import { X, Crown } from 'lucide-react'

interface MiniProPhoneProps {
  visible: boolean
  onClose: () => void
  onUpgrade: () => void
  mainPhoneHeight: number
  proVideoSrc?: string
}

export function MiniProPhone({ visible, onClose, onUpgrade, mainPhoneHeight, proVideoSrc }: MiniProPhoneProps) {
  const height = Math.round(mainPhoneHeight * 0.7)
  const width = Math.round(height * 9 / 16)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (visible && proVideoSrc) {
      if (!el.src || el.src !== window.location.origin + proVideoSrc) {
        el.src = proVideoSrc
      }
      el.loop = true
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [visible, proVideoSrc])

  return (
    <div
      className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
      style={{ width, height }}
    >
      <div className="relative h-full w-full rounded-2xl border-[1.5px] border-violet-500 bg-[#0d1025] overflow-hidden shadow-[0_0_24px_rgba(139,92,246,0.35)]">

        {/* PRO video */}
        {proVideoSrc && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain"
            playsInline
            loop
          />
        )}

        {/* Gradient overlay khi chưa có video */}
        {!proVideoSrc && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.25),transparent_60%)]" />
        )}

        {/* PRO badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[8px] font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-[0_2px_8px_rgba(139,92,246,0.4)]">
          <Crown className="h-2.5 w-2.5" /> PRO PREVIEW
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid h-5 w-5 place-items-center rounded-full bg-black/50 text-white/60 hover:text-white transition"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Upgrade button */}
        <button
          type="button"
          onClick={onUpgrade}
          className="absolute bottom-3 left-3 right-3 z-10 bg-gradient-to-r from-violet-500 to-purple-700 text-white py-2 rounded-lg text-[9px] font-bold hover:opacity-90 transition"
        >
          Nâng cấp PRO
        </button>
      </div>
    </div>
  )
}
