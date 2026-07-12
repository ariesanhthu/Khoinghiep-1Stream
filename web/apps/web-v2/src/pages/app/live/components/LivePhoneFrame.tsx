import { useRef, useState, useEffect, useCallback } from 'react'
import { Activity, BookOpen, Bot, Camera, ChevronRight, Eye, Play, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import { formatVND } from '@/lib/utils'
import type { Product } from '@/types'
import type { CameraFilter, ChatItem } from '../live-preview.lib'
import { getFilterClass } from '../live-preview.lib'
import { MiniProPhone } from './MiniProPhone'

interface LivePhoneFrameProps {
  isLive: boolean
  isWebcamActive: boolean
  activeFilter: CameraFilter
  previewThumbnail?: string
  previewModelName?: string
  showWatermark: boolean
  showTicker: boolean
  showSentimentCard: boolean
  copilotStatus: string | null
  isGenerating: boolean
  micGain: number
  product: Product
  topComment?: ChatItem
  viewers: number
  videoRef: React.RefObject<HTMLVideoElement | null>
  activePlaybackSrc: string | null
  onStart: () => void
  onWebcam: () => void
  onGenerate: () => void
  onToggleLive: () => void
  isPro: boolean
  proPhoneVisible: boolean
  onToggleProPhone: () => void
  onOpenProModal: () => void
}

export function LivePhoneFrame({
  isLive,
  isWebcamActive,
  activeFilter,
  previewThumbnail,
  previewModelName,
  showWatermark,
  showTicker,
  showSentimentCard,
  copilotStatus,
  isGenerating,
  micGain,
  product,
  topComment,
  viewers,
  videoRef,
  activePlaybackSrc,
  onStart,
  onWebcam,
  onGenerate,
  onToggleLive,
  isPro: _isPro,
  proPhoneVisible,
  onToggleProPhone,
  onOpenProModal,
}: LivePhoneFrameProps) {
  const filterClass = getFilterClass(activeFilter)
  const phoneRef = useRef<HTMLDivElement>(null)
  const playbackRef = useRef<HTMLVideoElement>(null)
  const [phoneHeight, setPhoneHeight] = useState(680)

  const syncPlayback = useCallback(() => {
    const el = playbackRef.current
    if (!el) return
    if (activePlaybackSrc && isLive) {
      if (el.src !== window.location.origin + activePlaybackSrc) {
        el.src = activePlaybackSrc
      }
      el.loop = true
      void el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [activePlaybackSrc, isLive])

  useEffect(() => { syncPlayback() }, [syncPlayback])

  useEffect(() => {
    if (phoneRef.current) {
      setPhoneHeight(phoneRef.current.clientHeight)
    }
  }, [])

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-[#eef1f5]">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white/70 px-5">
        <div><p className="text-xs font-black text-slate-800">Xem trước khung dọc</p><p className="text-[10px] text-slate-400">Nội dung người xem sẽ nhìn thấy</p></div>
        <div className="flex items-center gap-2"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">9:16</span><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">78%</span></div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-5 [background-image:radial-gradient(circle_at_1px_1px,rgba(100,116,139,.16)_1px,transparent_0)] [background-size:24px_24px]">

        <div ref={phoneRef} className={`relative h-[min(700px,100%)] aspect-[9/16] overflow-hidden rounded-[22px] border-[3px] bg-[#0c0f17] shadow-2xl transition-all duration-300 ${isLive ? 'border-slate-900 shadow-[0_24px_60px_rgba(15,23,42,.22)]' : 'border-slate-700 shadow-[0_20px_50px_rgba(15,23,42,.18)]'}`}>

          {/* AI playback video (free / pro / gốc) */}
          <video
            ref={playbackRef}
            className={`absolute inset-0 h-full w-full object-contain pointer-events-none transition-opacity duration-500 ${filterClass} ${activePlaybackSrc && isLive ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted={false}
          />

          {/* Webcam stream (shown when no AI playback) */}
          {isWebcamActive && isLive && !activePlaybackSrc && (
            <video ref={videoRef} className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform ${filterClass}`} playsInline muted />
          )}

          {/* Model thumbnail fallback */}
          {!activePlaybackSrc && !(isWebcamActive && isLive) && previewThumbnail && (
            <img src={previewThumbnail} alt={previewModelName} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${filterClass} ${isLive ? 'opacity-100 scale-100' : 'opacity-30 scale-100'}`} />
          )}

          {!activePlaybackSrc && !(isWebcamActive && isLive) && !previewThumbnail && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.22),transparent_40%),linear-gradient(to_bottom,#101625,#060910)]" />
          )}

          <div className="pointer-events-none absolute inset-0 live-scanline" />

          {showWatermark && (
            <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white">1Stream AI Live</span>
            </div>
          )}

          {copilotStatus && (
            <div className="absolute top-[35%] left-4 right-4 z-30 rounded-xl border border-primary/40 bg-black/85 p-3 text-center shadow-lg backdrop-blur-md animate-bounce pointer-events-none">
              <div className="flex justify-center gap-1 text-[9px] font-bold text-primary mb-1 uppercase tracking-wider">
                <Bot className="h-3 w-3" /> Trợ lý AI đang thực thi
              </div>
              <p className="text-xs font-semibold text-white leading-relaxed">{copilotStatus}</p>
            </div>
          )}

          {showSentimentCard && (
            <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1.5 backdrop-blur-md">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold text-white">Dữ liệu đã duyệt</span>
            </div>
          )}

          <button type="button" onClick={onToggleProPhone} className="absolute right-4 top-[52px] z-20 rounded-full border border-white/15 bg-white/90 px-2.5 py-1 text-[8px] font-black text-blue-700 shadow-lg transition hover:bg-white">So sánh bản nâng cao</button>

          {isLive ? (
            <LiveOverlay topComment={topComment} generating={isGenerating} viewers={viewers} micGain={micGain} />
          ) : (
            <ReadyState onStart={onStart} onWebcam={onWebcam} onGenerate={onGenerate} />
          )}

          {showTicker && isLive && (
            <div className="pointer-events-none absolute bottom-24 left-0 z-20 w-full overflow-hidden border-y border-blue-400/20 bg-blue-700/80 py-1.5 backdrop-blur-sm">
              <div className="flex whitespace-nowrap text-[8px] font-black uppercase tracking-wide text-white animate-[marquee_20s_linear_infinite] gap-4">
                <span>IELTS FOUNDATION 5.5 · KHAI GIẢNG 28/07 · KIỂM TRA ĐẦU VÀO MIỄN PHÍ · ĐĂNG KÝ HỌC THỬ</span>
                <span>IELTS FOUNDATION 5.5 · KHAI GIẢNG 28/07 · KIỂM TRA ĐẦU VÀO MIỄN PHÍ · ĐĂNG KÝ HỌC THỬ</span>
              </div>
            </div>
          )}

          <CourseDock product={product} />
        </div>

        <button
          type="button"
          onClick={onToggleLive}
          className={`absolute bottom-5 right-5 z-[15] grid h-11 w-11 place-items-center rounded-full border-4 border-white text-white shadow-xl transition-all duration-300 hover:scale-105 ${isLive ? 'bg-rose-500 shadow-rose-500/30 hover:bg-rose-600' : 'bg-blue-600 shadow-blue-600/30 hover:bg-blue-700'}`}
          aria-label={isLive ? 'Tạm dừng live' : 'Bật live'}
        >
          {isLive ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" fill="currentColor" />}
        </button>
        <MiniProPhone
          visible={proPhoneVisible}
          onClose={onToggleProPhone}
          onUpgrade={onOpenProModal}
          mainPhoneHeight={phoneHeight}
          proVideoSrc="/videos/video_pro.mp4"
        />
      </div>
    </section>
  )
}

/* ---- Internal sub-components ---- */

function ReadyState({ onStart, onWebcam, onGenerate }: { onStart: () => void; onWebcam: () => void; onGenerate: () => void }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/85 px-6 text-center text-white z-10 backdrop-blur-sm">
      <div className="w-full max-w-[240px]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)] animate-pulse">
          <Camera className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-lg font-bold text-white">Sẵn sàng xem trước</h2>
        <p className="mt-1 text-xs text-slate-300">Chọn ảnh, clip đã duyệt hoặc bật camera</p>
        <div className="mt-6 space-y-2.5">
          <button type="button" onClick={onWebcam} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white hover:opacity-90 shadow-md transition">
            <Camera className="h-4 w-4" /> Dùng camera trực tiếp
          </button>
          <button type="button" onClick={onStart} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white hover:bg-white/20 transition">
            <Play className="h-4 w-4 text-primary" /> Dùng ảnh live mẫu
          </button>
          <button type="button" onClick={onGenerate} className="h-10 w-full text-[11px] font-semibold text-primary hover:underline transition">
            Tạo thêm video AI mới
          </button>
        </div>
      </div>
    </div>
  )
}

function LiveOverlay({ topComment, generating, viewers, micGain }: { topComment?: ChatItem; generating: boolean; viewers: number; micGain: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white z-10 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded bg-rose-500 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1 animate-pulse">
          <div className="h-1.5 w-1.5 rounded-full bg-white" /> Live
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-black/60 border border-white/5 px-2.5 py-1 text-[9px] font-bold backdrop-blur-sm shadow-sm">
          <Eye className="h-3 w-3 text-rose-400" /> {viewers.toLocaleString('vi-VN')} người xem
        </div>
      </div>
      <div className="mb-20 space-y-2.5">
        {topComment ? (
          <div className="max-w-[90%] rounded-xl border border-primary/20 bg-black/75 p-2.5 backdrop-blur-md shadow-md animate-fade-in">
            <div className="mb-1 flex items-center gap-1 text-[9px] font-bold text-yellow-400 uppercase tracking-wide">
              <Sparkles className="h-3 w-3" /> Tiêu Điểm Hỏi Đáp
            </div>
            <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-white">{topComment.text}</p>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-[9px] font-bold">
          {generating ? (
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 shadow-md animate-pulse">
              <Wand2 className="h-3 w-3 animate-spin" /> Tạo Video AI
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 shadow-md">
              <Activity className="h-3 w-3 animate-pulse" /> FAQ trong dữ liệu
            </span>
          )}
          <div className="flex items-center gap-1 rounded bg-black/55 px-2 py-1 border border-white/5 backdrop-blur-sm">
            <span className="text-[8px] uppercase tracking-wider text-slate-300">Audio:</span>
            <span className="flex h-5 items-end gap-0.5">
              {[8, 14, 18, 12].map((height, index) => (
                <i key={index} className="w-0.5 origin-bottom rounded-full bg-emerald-400 transition-all"
                  style={{ height: `${height * (micGain / 100)}px`, animation: `live-pulse-bar 0.9s ease-in-out infinite`, animationDelay: `${index * 0.12}s` }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseDock({ product }: { product: Product }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-[15] flex items-center gap-2.5 rounded-2xl border border-white/15 bg-slate-950/85 p-2.5 shadow-xl backdrop-blur-md">
      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <BookOpen className="h-5 w-5 text-blue-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[8px] font-black uppercase tracking-[.14em] text-blue-200">Khóa học đang giới thiệu</p>
        <p className="truncate text-xs font-bold text-white leading-tight">{product.name}</p>
        <p className="mt-0.5 text-[11px] font-extrabold text-amber-300">Học phí {formatVND(product.price)}</p>
      </div>
      <div className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-blue-400/30 bg-blue-500/20 text-blue-200 transition hover:bg-blue-500/30">
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  )
}
