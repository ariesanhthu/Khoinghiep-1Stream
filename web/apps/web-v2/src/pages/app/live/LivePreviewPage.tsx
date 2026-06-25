import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  Clapperboard,
  Flame,
  ImageIcon,
  Plus,
  Radio,
  Settings2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Upload,
  Video,
  Zap,
} from 'lucide-react'

import { useModelStore } from '@/store/modelStore'
import { usePlatformStore } from '@/store/platformStore'
import { useProductStore } from '@/store/productStore'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import type { PlatformId } from '@/types'
import {
  type CameraFilter,
  type ChatItem,
  type ContentAsset,
  FALLBACK_PRODUCT,
  SAMPLE_COMMENTS,
  toChatItem,
} from './live-preview.lib'
import { AssetCard } from './components/AssetCard'
import { LeadCard } from './components/LeadCard'
import { LiveControlsPanel } from './components/LiveControlsPanel'
import { LivePhoneFrame } from './components/LivePhoneFrame'
import { LiveChatPanel } from './components/LiveChatPanel'
import { ProUpsellModal } from './components/ProUpsellModal'
import type { ProFeatureId } from './components/ProTooltip'

export function LivePreviewPage() {
  const products = useProductStore((s) => s.products)
  const models = useModelStore((s) => s.models)
  const platforms = usePlatformStore((s) => s.platforms)

  const product = products[0] ?? FALLBACK_PRODUCT
  const previewModel = models[0]

  const [isLive, setIsLive] = useState(true)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [activeFilter, setActiveFilter] = useState<CameraFilter>('none')
  const [micGain, setMicGain] = useState(78)
  const [isGenerating, setIsGenerating] = useState(false)
  const [assetTab, setAssetTab] = useState<'all' | 'video' | 'image'>('all')

  const [showWatermark, setShowWatermark] = useState(true)
  const [showTicker, setShowTicker] = useState(true)
  const [showSentimentCard, setShowSentimentCard] = useState(true)

  const [copilotStatus, setCopilotStatus] = useState<string | null>(null)
  const [liveChannelIds, setLiveChannelIds] = useState<PlatformId[]>([])
  const [showControls, setShowControls] = useState(false)
  const [activePlaybackSrc, setActivePlaybackSrc] = useState<string | null>('/videos/video_free.mp4')

  const subscription = useSubscriptionStore((s) => s.subscription)
  const isPro = subscription?.planId === 'pro'
  const [proModalOpen, setProModalOpen] = useState(false)
  const [proModalFeature, setProModalFeature] = useState<ProFeatureId | null>(null)
  const [proPhoneVisible, setProPhoneVisible] = useState(false)

  function openProModal(feature: ProFeatureId) {
    setProModalFeature(feature)
    setProModalOpen(true)
  }

  const [assets, setAssets] = useState<ContentAsset[]>([
    {
      id: 1, title: 'Video Gốc', duration: '30s', icon: Radio, active: true, bars: true,
      type: 'video', productLabel: 'Gốc', tier: 'goc',
      thumbnail: '/videos/thumbs/goc.jpg',
      videoSrc: '/videos/video_goc.mp4',
    },
    {
      id: 2, title: 'Gel Tẩy Da Chết', duration: '3 ảnh', icon: ImageIcon,
      type: 'image', productLabel: 'Sản phẩm',
      thumbnail: 'https://images.unsplash.com/photo-1571781926291-c50fb9722f63?w=320&h=180&fit=crop&auto=format&q=80',
    },
    {
      id: 3, title: 'Flash Sale 50%', duration: '2 ảnh', icon: Tag,
      type: 'image', productLabel: 'Khuyến mãi',
      thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=320&h=180&fit=crop&auto=format&q=80',
    },
    {
      id: 4, title: 'Q&A Clip Mẫu', duration: '45s', icon: BarChart3, bars: false,
      type: 'video', productLabel: 'Tương tác',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=320&h=180&fit=crop&auto=format&q=80',
    },
    {
      id: 5, title: 'Trailer Chào Mừng', duration: '01:20', icon: Clapperboard, muted: true,
      type: 'video', productLabel: 'Giới thiệu',
      thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cae08739?w=320&h=180&fit=crop&auto=format&q=80',
    },
    {
      id: 6, title: 'Ảnh Sản Phẩm Main', duration: '5 ảnh', icon: ShoppingBag,
      type: 'image', productLabel: 'Catalogue',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=320&h=180&fit=crop&auto=format&q=80',
    },
  ])
  const [comments, setComments] = useState<ChatItem[]>(() =>
    SAMPLE_COMMENTS.slice(0, 4).map((text, index) => toChatItem(text, index, product))
  )
  const [question, setQuestion] = useState('')
  const commentIndexRef = useRef(4)
  const chatListRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const uploadRef = useRef<HTMLInputElement>(null)

  function handleUploadAsset(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]
    const src = URL.createObjectURL(file)
    const isVideo = file.type.startsWith('video/')
    const newAsset: ContentAsset = {
      id: Date.now(),
      title: file.name.replace(/\.[^.]+$/, ''),
      duration: isVideo ? 'Video' : '1 ảnh',
      icon: isVideo ? Video : ImageIcon,
      type: isVideo ? 'video' : 'image',
      productLabel: 'Kho',
      thumbnail: isVideo ? '' : src,
      videoSrc: isVideo ? src : undefined,
    }
    setAssets((prev) => [newAsset, ...prev])
  }

  const hotLeads = useMemo(
    () => comments.filter((item) => item.sentiment === 'hot').slice(-3).reverse(),
    [comments]
  )

  // --- Effects ---

  useEffect(() => {
    if (isWebcamActive && isLive) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            void videoRef.current.play()
          }
        })
        .catch((error) => {
          console.error('Lỗi truy cập máy ảnh / microphone:', error)
          setIsWebcamActive(false)
        })
    } else if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }, [isWebcamActive, isLive])

  useEffect(() => {
    if (!isLive) return
    const timer = window.setInterval(() => {
      const current = commentIndexRef.current
      const text = SAMPLE_COMMENTS[current % SAMPLE_COMMENTS.length]
      setComments((items) => [...items.slice(-10), toChatItem(text, current, product)])
      commentIndexRef.current = current + 1
    }, 2600)
    return () => window.clearInterval(timer)
  }, [isLive, product])

  useEffect(() => {
    const chatList = chatListRef.current
    if (chatList) chatList.scrollTop = chatList.scrollHeight
  }, [comments.length])

  // --- Handlers ---

  function submitQuestion(text = question) {
    const trimmed = text.trim()
    if (!trimmed) return
    setComments((items) => [...items.slice(-10), toChatItem(trimmed, Date.now(), product)])
    setQuestion('')
  }

  function handleCopilotCommand(commandLabel: string, promptText: string) {
    setCopilotStatus(`Host AI đang nhận lệnh: "${commandLabel}"`)
    const id = Date.now()
    setTimeout(() => {
      setCopilotStatus(`AI Host đang nói: "[Hệ thống AI xử lý kịch bản: ${commandLabel}]"`)
      setComments((items) => [
        ...items.slice(-10),
        { id, name: '1Stream Co-Pilot', text: `[HỆ THỐNG AI ĐÃ KÍCH HOẠT PHẢN HỒI]: ${commandLabel}`, intent: 'Tương tác', answer: `Dạ xin kính chào quý khách, trợ lý AI vừa kích hoạt kịch bản: ${promptText.slice(0, 75)}...`, sentiment: 'warm' },
      ])
    }, 1500)
    setTimeout(() => setCopilotStatus(null), 6000)
  }

  function generateVideo() {
    const nextAsset: ContentAsset = { id: Date.now(), title: 'Video AI Tạo Mới', duration: 'Đang tạo...', icon: Video, muted: true, isCreating: true, type: 'video', productLabel: 'AI sinh', gradientFrom: '#1a1040', gradientTo: '#0d1025' }
    setIsGenerating(true)
    setAssets((items) => [nextAsset, ...items])
    window.setTimeout(() => {
      setIsGenerating(false)
      setAssets((items) => items.map((item) => item.id === nextAsset.id ? { ...item, duration: '32s', muted: false, bars: true, isCreating: false } : item))
    }, 1800)
  }

  function generateLiveFromAssets() {
    const nextAsset: ContentAsset = { id: Date.now(), title: 'Video Live từ kho', duration: 'Đang ghép...', icon: Video, muted: true, isCreating: true, type: 'video', productLabel: 'Từ kho', gradientFrom: '#1a0040', gradientTo: '#0d0025' }
    setIsGenerating(true)
    setAssets((items) => [nextAsset, ...items])
    window.setTimeout(() => {
      setIsGenerating(false)
      setAssets((items) => items.map((item) => item.id === nextAsset.id ? { ...item, duration: '55s', muted: false, bars: true, isCreating: false, active: false } : item))
    }, 2200)
  }

  function generateFromSource(source: ContentAsset) {
    const label = source.type === 'image' ? 'Video từ ảnh' : 'Remix từ clip'
    const nextAsset: ContentAsset = {
      id: Date.now(),
      title: `${label}: ${source.title}`,
      duration: 'Đang tạo...',
      icon: Video,
      muted: true,
      isCreating: true,
      type: 'video',
      productLabel: 'Từ nguồn',
      thumbnail: source.thumbnail,
    }
    setIsGenerating(true)
    setAssets((items) => [nextAsset, ...items])
    window.setTimeout(() => {
      setIsGenerating(false)
      setAssets((items) =>
        items.map((item) =>
          item.id === nextAsset.id
            ? { ...item, duration: '28s', muted: false, bars: true, isCreating: false }
            : item
        )
      )
    }, 2000)
  }

  function toggleChannel(id: PlatformId) {
    setLiveChannelIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  // --- Render ---

  return (
    <div className="h-full w-full bg-background text-foreground overflow-hidden">
      <div className="h-full w-full flex overflow-hidden gap-0">

        {/* LEFT COLUMN */}
        <aside className="hidden lg:flex flex-col h-full min-h-0 w-[300px] select-none shrink-0 border-r border-border bg-card/30">

          {/* Campaign header */}
          <div className="shrink-0 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" fill="currentColor" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-bold truncate">Campaign Hè Rực Rỡ</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{assets.filter(a => a.type === 'video').length} video</span>
                  <span className="text-[9px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{assets.filter(a => a.type === 'image').length} ảnh</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowControls(!showControls)}
                title="Điều khiển nâng cao"
                className={`grid h-7 w-7 place-items-center rounded-lg border transition ${showControls ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {showControls && (
            <LiveControlsPanel
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              micGain={micGain}
              setMicGain={setMicGain}
              showWatermark={showWatermark}
              setShowWatermark={setShowWatermark}
              showTicker={showTicker}
              setShowTicker={setShowTicker}
              showSentimentCard={showSentimentCard}
              setShowSentimentCard={setShowSentimentCard}
              onCopilotCommand={handleCopilotCommand}
              isPro={isPro}
              onOpenProModal={openProModal}
            />
          )}

          {/* KHO NỘI DUNG */}
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden">

            {/* Section header + filter tabs */}
            <div className="shrink-0 px-3 pt-3 pb-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Kho nội dung</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => uploadRef.current?.click()}
                    title="Tải lên ảnh / video"
                    className="flex items-center gap-1 rounded-md border border-dashed border-border bg-secondary hover:border-primary hover:text-primary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground transition"
                  >
                    <Upload className="h-3 w-3" /> Tải lên
                  </button>
                  <input
                    ref={uploadRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => { handleUploadAsset(e.target.files); e.target.value = '' }}
                  />
                  <Settings2 className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>
              <div className="flex gap-1">
                {(['all', 'video', 'image'] as const).map((tab) => {
                  const label = tab === 'all' ? 'Tất cả' : tab === 'video' ? 'Video' : 'Ảnh'
                  const count = tab === 'all' ? assets.length : assets.filter(a => a.type === tab).length
                  return (
                    <button key={tab} type="button" onClick={() => setAssetTab(tab)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${assetTab === tab ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    >
                      {label} <span className="opacity-70">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2-column asset grid */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-1 scrollbar-thin">
              <div className="grid grid-cols-2 gap-2">
                {assets
                  .filter(a => assetTab === 'all' || a.type === assetTab)
                  .map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onGenerateFromSource={() => generateFromSource(asset)}
                    />
                  ))}
              </div>
            </div>

            {/* Tạo video — 3 tiers: Gốc | Free | Pro */}
            <div className="shrink-0 border-t border-border px-3 py-3 space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">AI tạo livestream từ kho</span>
              <div className="grid grid-cols-3 gap-1.5">
                {/* Gốc */}
                <button
                  type="button"
                  onClick={isGenerating ? undefined : generateLiveFromAssets}
                  disabled={isGenerating}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-secondary hover:bg-secondary/60 px-2 py-2.5 transition disabled:opacity-50"
                >
                  <Zap className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-[9px] font-bold text-foreground leading-tight">Gốc</span>
                </button>
                {/* Free */}
                <button
                  type="button"
                  onClick={generateVideo}
                  className="flex flex-col items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/15 px-2 py-2.5 transition"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[9px] font-bold text-primary leading-tight">Free</span>
                </button>
                {/* Pro */}
                <button
                  type="button"
                  onClick={isPro ? generateVideo : () => openProModal('video-ai')}
                  className="flex flex-col items-center gap-1 rounded-lg border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 px-2 py-2.5 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-[9px] font-bold text-violet-400 leading-tight">Pro</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hot Leads */}
          <div className="shrink-0 border-t border-border px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-rose-500" /> Hot Leads
              </span>
              <span className="text-[10px] font-bold text-primary">Top {hotLeads.length}</span>
            </div>
            {hotLeads.length === 0 ? (
              <p className="text-[11px] text-muted-foreground text-center py-2">Chưa phát hiện lead mua hàng</p>
            ) : (
              <div className="space-y-1.5">
                {hotLeads.map((lead) => <LeadCard key={`${lead.id}-lead`} lead={lead} />)}
              </div>
            )}
          </div>
        </aside>

        {/* MIDDLE: PHONE PREVIEW */}
        <LivePhoneFrame
          isLive={isLive}
          isWebcamActive={isWebcamActive}
          activeFilter={activeFilter}
          previewThumbnail={previewModel?.thumbnail}
          previewModelName={previewModel?.name}
          showWatermark={showWatermark}
          showTicker={showTicker && isLive}
          showSentimentCard={showSentimentCard}
          copilotStatus={copilotStatus}
          isGenerating={isGenerating}
          micGain={micGain}
          product={product}
          topComment={hotLeads[0]}
          viewers={comments.length * 37 + 412}
          videoRef={videoRef}
          activePlaybackSrc={activePlaybackSrc}
          onStart={() => { setIsLive(true); setActivePlaybackSrc('/videos/video_goc.mp4') }}
          onWebcam={() => { setIsLive(true); setIsWebcamActive(true); setActivePlaybackSrc('/videos/video_free.mp4') }}
          onGenerate={generateVideo}
          onToggleLive={() => { const next = !isLive; setIsLive(next); if (!next) { setIsWebcamActive(false); setActivePlaybackSrc(null) } }}
          isPro={isPro}
          proPhoneVisible={proPhoneVisible}
          onToggleProPhone={() => setProPhoneVisible((v) => !v)}
          onOpenProModal={() => openProModal('video-ai')}
        />

        {/* RIGHT: CHAT */}
        <LiveChatPanel
          platforms={platforms}
          liveChannelIds={liveChannelIds}
          onToggleChannel={toggleChannel}
          comments={comments}
          chatListRef={chatListRef}
          question={question}
          onQuestionChange={setQuestion}
          onSubmitQuestion={submitQuestion}
          isPro={isPro}
          onOpenProModal={openProModal}
        />
      </div>
      <ProUpsellModal
        open={proModalOpen}
        onClose={() => setProModalOpen(false)}
        feature={proModalFeature}
      />
    </div>
  )
}
