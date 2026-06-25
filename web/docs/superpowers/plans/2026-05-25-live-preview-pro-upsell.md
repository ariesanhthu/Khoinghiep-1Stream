# Live Preview PRO Upsell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add freemium PRO upsell system to the Live Preview page — badge PRO on locked features, tooltip hover previews, modal upsell with video demo area, mini phone PRO preview panel, and redesigned asset cards with thumbnails.

**Architecture:** Reuse existing shadcn/ui primitives (Tooltip, Dialog, Badge) and Zustand subscriptionStore (`isPro` derived from current plan). New components: ProBadge, ProTooltip, ProUpsellModal, MiniProPhone. Modify existing LiveControlsPanel, LiveChatPanel, LivePhoneFrame, AssetCard, and LivePreviewPage to integrate PRO state gating.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Zustand, Radix UI (Tooltip, Dialog), Lucide icons.

---

### Task 1: Add PRO CSS animations and design tokens

**Files:**
- Modify: `apps/web-v2/src/index.css`

- [ ] **Step 1: Add PRO design tokens and animations to index.css**

Add these at the end of the existing `@layer base` block (after the existing CSS variables):

```css
/* Inside :root */
--pro-from: 265 85% 55%;
--pro-to: 275 90% 42%;
```

Then add at the end of the file:

```css
@keyframes pro-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

.pro-glow-ring {
  animation: pro-glow 2s ease-in-out infinite;
}
```

- [ ] **Step 2: Verify build**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/index.css
git commit -m "feat(web-v2): add PRO design tokens and glow animation"
```

---

### Task 2: Create ProBadge component

**Files:**
- Create: `apps/web-v2/src/pages/app/live/components/ProBadge.tsx`

- [ ] **Step 1: Create ProBadge.tsx**

```tsx
import { Crown } from 'lucide-react'

interface ProBadgeProps {
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export function ProBadge({ size = 'sm', onClick, className = '' }: ProBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[8px] gap-0.5'
    : 'px-2 py-0.5 text-[9px] gap-1'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-purple-700 text-white font-extrabold tracking-wide cursor-pointer hover:opacity-90 transition shrink-0 ${sizeClasses} ${className}`}
    >
      <Crown className={size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'} />
      PRO
    </button>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/ProBadge.tsx
git commit -m "feat(web-v2): create ProBadge reusable component"
```

---

### Task 3: Create ProTooltip component

**Files:**
- Create: `apps/web-v2/src/pages/app/live/components/ProTooltip.tsx`

Uses the existing Radix UI Tooltip primitives from `@/components/ui/tooltip`.

- [ ] **Step 1: Create ProTooltip.tsx**

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProBadge } from './ProBadge'

interface ProTooltipProps {
  feature: ProFeatureId
  children: React.ReactNode
  onOpenModal: (feature: ProFeatureId) => void
}

export type ProFeatureId = 'copilot' | 'auto-reply' | 'overlay' | 'video-ai'

const FEATURE_INFO: Record<ProFeatureId, { title: string; description: string }> = {
  'copilot': {
    title: 'AI Copilot tự động',
    description: 'Copilot ra lệnh bán hàng, đọc bình luận, kể chuyện — tất cả tự động 24/7.',
  },
  'auto-reply': {
    title: 'AI Tự Trả Lời',
    description: 'AI tự nhận diện câu hỏi và trả lời realtime trong chatbox. Không bỏ lỡ khách hàng.',
  },
  'overlay': {
    title: 'Overlay tuỳ chỉnh',
    description: 'Tùy chỉnh watermark thương hiệu, ticker khuyến mãi chạy ngang — chuyên nghiệp hơn.',
  },
  'video-ai': {
    title: 'Video AI Động',
    description: 'Video AI generate biểu cảm, cử chỉ tự nhiên — không chỉ nhép miệng.',
  },
}

export function ProTooltip({ feature, children, onOpenModal }: ProTooltipProps) {
  const info = FEATURE_INFO[feature]

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="w-56 rounded-xl border-violet-500/50 bg-[#1e1e2e] p-3 shadow-[0_8px_24px_rgba(139,92,246,0.25)]"
        >
          <p className="text-[11px] font-bold text-white mb-1">{info.title}</p>
          <p className="text-[10px] text-[#aaa] leading-relaxed mb-2">{info.description}</p>
          <button
            type="button"
            onClick={() => onOpenModal(feature)}
            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition"
          >
            Xem demo →
          </button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/ProTooltip.tsx
git commit -m "feat(web-v2): create ProTooltip hover component with feature descriptions"
```

---

### Task 4: Create ProUpsellModal component

**Files:**
- Create: `apps/web-v2/src/pages/app/live/components/ProUpsellModal.tsx`

Uses the existing Radix Dialog from `@/components/ui/dialog` and reads plan pricing from `subscriptionStore`.

- [ ] **Step 1: Create ProUpsellModal.tsx**

```tsx
import { Play, Check, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { formatVND } from '@/lib/utils'
import type { ProFeatureId } from './ProTooltip'

interface ProUpsellModalProps {
  open: boolean
  onClose: () => void
  feature: ProFeatureId | null
}

const FEATURE_DETAILS: Record<ProFeatureId, { title: string; description: string; highlights: string[] }> = {
  'copilot': {
    title: 'AI Copilot — Trợ lý bán hàng 24/7',
    description: 'Ra lệnh bằng 1 nút bấm: kêu gọi chốt đơn, phát voucher, đọc bình luận, kể chuyện vui — AI xử lý tất cả trong khi bạn chỉ cần focus vào sản phẩm.',
    highlights: ['4 lệnh copilot tùy chỉnh', 'Tự động kêu gọi chốt đơn', 'Đọc và phản hồi bình luận', 'Kể chuyện tương tác với khách'],
  },
  'auto-reply': {
    title: 'AI Tự Trả Lời — Không bỏ lỡ khách hàng',
    description: 'AI phân tích ngữ cảnh bình luận realtime, tự động trả lời đúng và nhanh. Khách hỏi giá, hỏi ship, hỏi sản phẩm — đều được phản hồi ngay.',
    highlights: ['Trả lời comment realtime', 'Phân tích intent khách hàng', 'Tùy chỉnh tone giọng trả lời', 'Hỗ trợ đa nền tảng'],
  },
  'overlay': {
    title: 'Overlay Chuyên Nghiệp',
    description: 'Tùy chỉnh watermark thương hiệu, ticker khuyến mãi chạy ngang màn hình — nâng tầm chuyên nghiệp cho livestream.',
    highlights: ['Watermark logo thương hiệu', 'Ticker khuyến mãi chạy ngang', 'Tuỳ chỉnh vị trí & màu sắc', 'Bật/tắt linh hoạt'],
  },
  'video-ai': {
    title: 'Video AI Động — Vượt xa Lip-sync',
    description: 'Không chỉ nhép miệng — AI generate lại toàn bộ video với biểu cảm, cử chỉ tự nhiên. Chất lượng 2K, thời lượng tối đa 30 phút.',
    highlights: ['AI generate biểu cảm tự nhiên', 'Chất lượng 2K', 'Thời lượng tối đa 30 phút', 'Video không giới hạn'],
  },
}

export function ProUpsellModal({ open, onClose, feature }: ProUpsellModalProps) {
  const plans = useSubscriptionStore((s) => s.plans)
  const startTrial = useSubscriptionStore((s) => s.startTrial)
  const proPlan = plans.find((p) => p.id === 'pro')

  if (!feature) return null

  const details = FEATURE_DETAILS[feature]

  function handleUpgrade() {
    startTrial('pro')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] p-0 gap-0 border-border bg-[#13162a] overflow-hidden">
        {/* Video preview area */}
        <div className="relative h-[200px] bg-gradient-to-br from-[#1a1040] to-[#0d1025] flex flex-col items-center justify-center border-b border-border">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-500/20 border-2 border-violet-500/40 cursor-pointer hover:bg-violet-500/30 transition">
            <Play className="h-5 w-5 text-violet-500 ml-0.5" fill="currentColor" />
          </div>
          <p className="mt-2.5 text-[11px] text-violet-500/50 font-semibold">Bấm để xem demo {details.title.split('—')[0].trim()}</p>
          <span className="absolute top-3 right-3 bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wide">
            PRO FEATURE
          </span>
        </div>

        {/* Content area */}
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-white mb-1.5">{details.title}</h3>
          <p className="text-xs text-[#888] leading-relaxed mb-4">{details.description}</p>

          <div className="space-y-2 mb-5">
            {details.highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[11px] text-[#ccc]">
                <Check className="h-3 w-3 text-violet-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white border-none py-3 rounded-xl text-[13px] font-bold cursor-pointer hover:opacity-90 transition"
            >
              Nâng cấp PRO — {proPlan ? formatVND(proPlan.priceMonthly) : '999.000₫'}/tháng
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-[#333] text-[#888] py-3 px-5 rounded-xl text-xs cursor-pointer hover:border-[#555] hover:text-[#aaa] transition"
            >
              Để sau
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/ProUpsellModal.tsx
git commit -m "feat(web-v2): create ProUpsellModal with video demo area and CTA"
```

---

### Task 5: Create MiniProPhone component

**Files:**
- Create: `apps/web-v2/src/pages/app/live/components/MiniProPhone.tsx`

- [ ] **Step 1: Create MiniProPhone.tsx**

```tsx
import { Play, X } from 'lucide-react'
import { Crown } from 'lucide-react'

interface MiniProPhoneProps {
  visible: boolean
  onClose: () => void
  onUpgrade: () => void
  mainPhoneHeight: number
}

export function MiniProPhone({ visible, onClose, onUpgrade, mainPhoneHeight }: MiniProPhoneProps) {
  const height = Math.round(mainPhoneHeight * 0.7)
  const width = Math.round(height * 9 / 16)

  return (
    <div
      className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
      style={{ width, height }}
    >
      <div className="relative h-full w-full rounded-2xl border-[1.5px] border-violet-500 bg-gradient-to-b from-[#1a1040] to-[#0d1025] overflow-hidden shadow-[0_0_24px_rgba(139,92,246,0.25)]">
        {/* Radial glow bg */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.25),transparent_60%)]" />

        {/* PRO PREVIEW badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[8px] font-extrabold px-2.5 py-1 rounded-full tracking-wide shadow-[0_2px_8px_rgba(139,92,246,0.4)]">
          <Crown className="h-2.5 w-2.5" /> PRO PREVIEW
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid h-5 w-5 place-items-center rounded-full bg-black/40 text-[#888] hover:text-white transition"
        >
          <X className="h-3 w-3" />
        </button>

        {/* Play button center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-500/20 border-2 border-violet-500/50 cursor-pointer hover:bg-violet-500/30 transition">
            <Play className="h-4 w-4 text-violet-500 ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center w-4/5 z-10">
          <p className="text-[9px] font-bold text-violet-300">AI Generate Động</p>
          <p className="text-[8px] text-[#666] mt-0.5">So sánh chất lượng video</p>
        </div>

        {/* CTA button */}
        <button
          type="button"
          onClick={onUpgrade}
          className="absolute bottom-3 left-3 right-3 z-10 bg-gradient-to-r from-violet-500 to-purple-700 text-white border-none py-2 rounded-lg text-[9px] font-bold cursor-pointer hover:opacity-90 transition"
        >
          Nâng cấp PRO
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/MiniProPhone.tsx
git commit -m "feat(web-v2): create MiniProPhone slide-in PRO preview panel"
```

---

### Task 6: Redesign AssetCard with thumbnail

**Files:**
- Modify: `apps/web-v2/src/pages/app/live/components/AssetCard.tsx`
- Modify: `apps/web-v2/src/pages/app/live/live-preview.lib.ts` (add `thumbnail` field to ContentAsset)

- [ ] **Step 1: Add thumbnail field to ContentAsset interface**

In `apps/web-v2/src/pages/app/live/live-preview.lib.ts`, update the `ContentAsset` interface:

```ts
export interface ContentAsset {
  id: number
  title: string
  duration: string
  icon: LucideIcon
  active?: boolean
  muted?: boolean
  bars?: boolean
  isCreating?: boolean
  thumbnail?: string
}
```

No other changes to this file.

- [ ] **Step 2: Rewrite AssetCard.tsx with thumbnail area**

Replace the entire content of `apps/web-v2/src/pages/app/live/components/AssetCard.tsx`:

```tsx
import type { ContentAsset } from '../live-preview.lib'

export function AssetCard({ asset }: { asset: ContentAsset }) {
  const Icon = asset.icon

  return (
    <button
      type="button"
      className={`relative w-full overflow-hidden rounded-lg text-left border group transition hover:border-primary/50 ${asset.active ? 'border-primary bg-card' : asset.muted ? 'border-border bg-secondary/50' : 'border-border bg-card'}`}
    >
      {/* Thumbnail area */}
      <div className="relative h-[72px] bg-gradient-to-br from-[#1a1040]/60 to-[#0d1025]/60 flex items-center justify-center overflow-hidden">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Icon className="h-6 w-6 text-primary/40" />
        )}
        {/* Duration badge */}
        <span className="absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-bold text-white">
          {asset.isCreating ? '...' : asset.duration}
        </span>
        {/* Active status badge */}
        {asset.active && (
          <span className="absolute top-1.5 left-1.5 bg-primary px-1.5 py-0.5 rounded text-[7px] font-extrabold text-white uppercase tracking-wider">
            Đang phát
          </span>
        )}
        {/* Audio bars overlay when active */}
        {asset.bars && asset.active && (
          <div className="absolute bottom-1.5 left-1.5 flex h-4 items-end gap-px">
            {[32, 54, 40, 68, 48].map((height, index) => (
              <span
                key={index}
                className="w-0.5 rounded-sm bg-white/70"
                style={{
                  height: `${height * 0.04}rem`,
                  animation: 'live-pulse-bar 1.2s ease-in-out infinite',
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {/* Text area */}
      <div className="px-2.5 py-2">
        <p className="truncate text-[10px] font-bold text-foreground">{asset.title}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">
          {asset.isCreating ? 'Đang tạo...' : `Lip-sync · ${asset.duration}`}
        </p>
      </div>
    </button>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/AssetCard.tsx apps/web-v2/src/pages/app/live/live-preview.lib.ts
git commit -m "feat(web-v2): redesign AssetCard with thumbnail preview area"
```

---

### Task 7: Update LiveControlsPanel with PRO badges

**Files:**
- Modify: `apps/web-v2/src/pages/app/live/components/LiveControlsPanel.tsx`

Add `isPro` prop. When `!isPro`: Copilot section header and Overlay section header get ProBadge + ProTooltip. Copilot command buttons get opacity + badge. Overlay toggles get disabled state.

- [ ] **Step 1: Update LiveControlsPanel with PRO gating**

Replace entire content of `apps/web-v2/src/pages/app/live/components/LiveControlsPanel.tsx`:

```tsx
import { Bot, Mic, Palette, Layers } from 'lucide-react'
import type { CameraFilter } from '../live-preview.lib'
import { FILTER_LABELS, COPILOT_COMMANDS } from '../live-preview.lib'
import { ProBadge } from './ProBadge'
import { ProTooltip } from './ProTooltip'
import type { ProFeatureId } from './ProTooltip'

interface LiveControlsPanelProps {
  activeFilter: CameraFilter
  setActiveFilter: (f: CameraFilter) => void
  micGain: number
  setMicGain: (v: number) => void
  showWatermark: boolean
  setShowWatermark: (v: boolean) => void
  showTicker: boolean
  setShowTicker: (v: boolean) => void
  showSentimentCard: boolean
  setShowSentimentCard: (v: boolean) => void
  onCopilotCommand: (label: string, prompt: string) => void
  isPro: boolean
  onOpenProModal: (feature: ProFeatureId) => void
}

export function LiveControlsPanel({
  activeFilter,
  setActiveFilter,
  micGain,
  setMicGain,
  showWatermark,
  setShowWatermark,
  showTicker,
  setShowTicker,
  showSentimentCard,
  setShowSentimentCard,
  onCopilotCommand,
  isPro,
  onOpenProModal,
}: LiveControlsPanelProps) {
  const overlays = [
    { label: 'Watermark', value: showWatermark, toggle: () => setShowWatermark(!showWatermark) },
    { label: 'Ticker khuyến mãi', value: showTicker, toggle: () => setShowTicker(!showTicker) },
    { label: 'Cảm xúc AI', value: showSentimentCard, toggle: () => setShowSentimentCard(!showSentimentCard) },
  ]

  return (
    <div className="shrink-0 border-b border-border px-4 py-3 space-y-3">
      {/* Camera filters — FREE */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Palette className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bộ lọc camera</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {FILTER_LABELS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-md border px-2 py-1.5 text-[10px] font-semibold transition ${activeFilter === f.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mic gain — FREE */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Mic className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mic gain</span>
          </div>
          <span className="text-[10px] font-bold text-foreground">{micGain}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={micGain}
          onChange={(e) => setMicGain(Number(e.target.value))}
          className="w-full h-1.5 rounded-full bg-secondary appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Overlay — PRO */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Layers className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overlay</span>
          {!isPro && (
            <ProTooltip feature="overlay" onOpenModal={onOpenProModal}>
              <span><ProBadge size="sm" onClick={() => onOpenProModal('overlay')} /></span>
            </ProTooltip>
          )}
        </div>
        <div className="space-y-1.5">
          {overlays.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={isPro ? item.toggle : () => onOpenProModal('overlay')}
              className={`flex items-center justify-between w-full ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-[11px] text-foreground">{item.label}</span>
              <div className={`grid h-5 w-9 place-items-center rounded-full transition-colors ${item.value && isPro ? 'bg-primary' : 'bg-secondary'}`}>
                <div className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${item.value && isPro ? 'translate-x-1.5' : '-translate-x-1.5'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Copilot — PRO */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Bot className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Copilot</span>
          {!isPro && (
            <ProTooltip feature="copilot" onOpenModal={onOpenProModal}>
              <span><ProBadge size="sm" onClick={() => onOpenProModal('copilot')} /></span>
            </ProTooltip>
          )}
        </div>
        <div className="space-y-1">
          {COPILOT_COMMANDS.map((cmd) => (
            <button
              key={cmd.label}
              type="button"
              onClick={isPro ? () => onCopilotCommand(cmd.label, cmd.prompt) : () => onOpenProModal('copilot')}
              className={`w-full rounded-md border border-border px-2.5 py-1.5 text-[10px] font-semibold text-foreground transition text-left flex items-center justify-between ${isPro ? 'hover:border-primary hover:text-primary' : 'opacity-60 cursor-not-allowed'}`}
            >
              {cmd.label}
              {!isPro && <ProBadge size="sm" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck** (will fail because LivePreviewPage doesn't pass new props yet — that's expected, we'll fix in Task 10)

Note: Typecheck may show errors for missing props in LivePreviewPage.tsx. These will be resolved in Task 10.

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/LiveControlsPanel.tsx
git commit -m "feat(web-v2): add PRO badges and gating to LiveControlsPanel"
```

---

### Task 8: Update LiveChatPanel with PRO badge on auto-reply

**Files:**
- Modify: `apps/web-v2/src/pages/app/live/components/LiveChatPanel.tsx`

Add `isPro` prop. The "AI Online" indicator gets a ProBadge when `!isPro`.

- [ ] **Step 1: Update LiveChatPanel with PRO indicator**

In `apps/web-v2/src/pages/app/live/components/LiveChatPanel.tsx`:

Add imports at the top (after existing imports):

```tsx
import { ProBadge } from './ProBadge'
import { ProTooltip } from './ProTooltip'
import type { ProFeatureId } from './ProTooltip'
```

Update the interface to add new props:

```tsx
interface LiveChatPanelProps {
  platforms: Platform[]
  liveChannelIds: PlatformId[]
  onToggleChannel: (id: PlatformId) => void
  comments: ChatItem[]
  chatListRef: React.RefObject<HTMLDivElement | null>
  question: string
  onQuestionChange: (v: string) => void
  onSubmitQuestion: (text?: string) => void
  isPro: boolean
  onOpenProModal: (feature: ProFeatureId) => void
}
```

Update the function signature to destructure the new props:

```tsx
export function LiveChatPanel({
  platforms,
  liveChannelIds,
  onToggleChannel,
  comments,
  chatListRef,
  question,
  onQuestionChange,
  onSubmitQuestion,
  isPro,
  onOpenProModal,
}: LiveChatPanelProps) {
```

Replace the "AI Online" status indicator (the `<span>` with class `flex items-center gap-1 text-[10px] font-bold text-emerald-600`):

```tsx
          <span className="flex items-center gap-1.5 text-[10px] font-bold">
            {isPro ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600">AI Online</span>
              </>
            ) : (
              <ProTooltip feature="auto-reply" onOpenModal={onOpenProModal}>
                <span className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-muted-foreground">AI Offline</span>
                  <ProBadge size="sm" onClick={() => onOpenProModal('auto-reply')} />
                </span>
              </ProTooltip>
            )}
          </span>
```

- [ ] **Step 2: Typecheck** (may have errors until Task 10 wires props)

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/LiveChatPanel.tsx
git commit -m "feat(web-v2): add PRO badge to auto-reply AI indicator in chat panel"
```

---

### Task 9: Update LivePhoneFrame with PRO preview button and MiniProPhone

**Files:**
- Modify: `apps/web-v2/src/pages/app/live/components/LivePhoneFrame.tsx`

Add the "Xem PRO" floating button (below sentiment card) and render MiniProPhone.

- [ ] **Step 1: Update LivePhoneFrame**

Add imports at the top of `apps/web-v2/src/pages/app/live/components/LivePhoneFrame.tsx` (after existing imports):

```tsx
import { Crown } from 'lucide-react'
import { MiniProPhone } from './MiniProPhone'
```

Add new props to the `LivePhoneFrameProps` interface (after `onToggleLive`):

```tsx
  isPro: boolean
  proPhoneVisible: boolean
  onToggleProPhone: () => void
  onOpenProModal: () => void
```

Add the new props to the destructuring in the function signature.

Inside the component, after the `filterClass` declaration, add:

```tsx
  const phoneRef = useRef<HTMLDivElement>(null)
  const [phoneHeight, setPhoneHeight] = useState(680)
```

Add a `useEffect` to measure phone height (requires adding `import { useRef, useState, useEffect } from 'react'` — note: only `useRef`, `useState`, `useEffect` are needed, remove `React` default import if unused):

Wait — `LivePhoneFrame` doesn't currently import React hooks. Add this import at the very top:

```tsx
import { useRef, useState, useEffect } from 'react'
```

After `phoneRef` and `phoneHeight` declarations, add:

```tsx
  useEffect(() => {
    if (phoneRef.current) {
      setPhoneHeight(phoneRef.current.clientHeight)
    }
  }, [])
```

On the phone frame `<div>` (the one with `className` starting with `relative h-[min(680px,100%)] aspect-[9/16]`), add `ref={phoneRef}`.

After the sentiment card closing `</div>` (the one with `showSentimentCard && (...)`), add the PRO preview button:

```tsx
          {!isPro && (
            <button
              type="button"
              onClick={onToggleProPhone}
              className="absolute top-[52px] right-4 z-20 group"
            >
              <span className="absolute inset-[-4px] rounded-full bg-violet-500/30 pro-glow-ring" />
              <span className="relative flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[8px] font-extrabold px-2.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(139,92,246,0.4)] group-hover:opacity-90 transition">
                <Crown className="h-2.5 w-2.5" /> Xem PRO
              </span>
            </button>
          )}
```

Inside the inner `<div>` with className `flex-1 min-h-0 flex items-center justify-center bg-muted/50 relative overflow-hidden p-6`, after the toggle live `<button>` (the `absolute bottom-6 right-6` button), add MiniProPhone (this div has `relative` positioning which MiniProPhone's `absolute` depends on):

```tsx
        {!isPro && (
          <MiniProPhone
            visible={proPhoneVisible}
            onClose={onToggleProPhone}
            onUpgrade={onOpenProModal}
            mainPhoneHeight={phoneHeight}
          />
        )}
```

- [ ] **Step 2: Typecheck** (may have errors until Task 10 wires props)

- [ ] **Step 3: Commit**

```bash
git add apps/web-v2/src/pages/app/live/components/LivePhoneFrame.tsx
git commit -m "feat(web-v2): add PRO preview button and MiniProPhone to phone frame"
```

---

### Task 10: Wire everything together in LivePreviewPage

**Files:**
- Modify: `apps/web-v2/src/pages/app/live/LivePreviewPage.tsx`

Add PRO state management, import ProUpsellModal, pass `isPro` + `onOpenProModal` to all child components, split video generation buttons.

- [ ] **Step 1: Update LivePreviewPage imports**

At the top of `apps/web-v2/src/pages/app/live/LivePreviewPage.tsx`, add to existing imports:

```tsx
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { ProUpsellModal } from './components/ProUpsellModal'
import type { ProFeatureId } from './components/ProTooltip'
```

- [ ] **Step 2: Add PRO state inside the component**

After the existing state declarations (after `const [showControls, setShowControls] = useState(false)`), add:

```tsx
  const subscription = useSubscriptionStore((s) => s.subscription)
  const isPro = subscription?.planId === 'pro'
  const [proModalOpen, setProModalOpen] = useState(false)
  const [proModalFeature, setProModalFeature] = useState<ProFeatureId | null>(null)
  const [proPhoneVisible, setProPhoneVisible] = useState(false)

  function openProModal(feature: ProFeatureId) {
    setProModalFeature(feature)
    setProModalOpen(true)
  }
```

- [ ] **Step 3: Update LiveControlsPanel props**

Find the `<LiveControlsPanel` JSX and add two new props at the end:

```tsx
              isPro={isPro}
              onOpenProModal={openProModal}
```

- [ ] **Step 4: Update LivePhoneFrame props**

Find the `<LivePhoneFrame` JSX and add four new props at the end:

```tsx
          isPro={isPro}
          proPhoneVisible={proPhoneVisible}
          onToggleProPhone={() => setProPhoneVisible((v) => !v)}
          onOpenProModal={() => openProModal('video-ai')}
```

- [ ] **Step 5: Update LiveChatPanel props**

Find the `<LiveChatPanel` JSX and add two new props at the end:

```tsx
          isPro={isPro}
          onOpenProModal={openProModal}
```

- [ ] **Step 6: Split video generation buttons**

Replace the existing "Tạo Video AI" button in the left sidebar:

Find:
```tsx
              <Button type="button" variant="outline" className="h-9 w-full border-border bg-secondary hover:bg-secondary/80 text-foreground gap-2 font-bold text-xs" onClick={generateVideo}>
                <Plus className="h-3.5 w-3.5 text-primary" /> Tạo Video AI
              </Button>
```

Replace with:
```tsx
              <div className="space-y-1.5">
                <Button type="button" variant="outline" className="h-9 w-full border-border bg-secondary hover:bg-secondary/80 text-foreground gap-2 font-bold text-xs" onClick={generateVideo}>
                  <Plus className="h-3.5 w-3.5 text-primary" /> Tạo Video Lip-sync
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15 text-foreground gap-2 font-bold text-xs"
                  onClick={isPro ? generateVideo : () => openProModal('video-ai')}
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Tạo Video AI Động
                  {!isPro && (
                    <span className="ml-auto bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">PRO</span>
                  )}
                </Button>
              </div>
```

Note: Need to add `Sparkles` to the lucide-react import if not already there. Check the existing import — it's not currently imported. Add it:

Find the lucide-react import line and add `Sparkles`:
```tsx
import {
  BarChart3,
  Clapperboard,
  Flame,
  Plus,
  Radio,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Video,
  Zap,
} from 'lucide-react'
```

Wait — `Sparkles` is not in the current import. But looking at the existing code, the import already doesn't include it. Add it between `SlidersHorizontal` and `Video`.

- [ ] **Step 7: Add ProUpsellModal to the render**

At the end of the outermost `<div>`, just before its closing tag, add:

```tsx
      <ProUpsellModal
        open={proModalOpen}
        onClose={() => setProModalOpen(false)}
        feature={proModalFeature}
      />
```

- [ ] **Step 8: Typecheck**

Run: `cd apps/web-v2 && npx tsc --noEmit -p tsconfig.app.json`
Expected: no errors — all props should now be wired correctly

- [ ] **Step 9: Commit**

```bash
git add apps/web-v2/src/pages/app/live/LivePreviewPage.tsx
git commit -m "feat(web-v2): wire PRO upsell system into LivePreviewPage"
```

---

### Task 11: Visual verification

**Files:** none (read-only verification)

- [ ] **Step 1: Start dev server**

Run: `cd /home/tvconss/Workspace/sea-hackathon-2026/web && npx turbo run dev --filter=web-v2`

- [ ] **Step 2: Open browser and verify**

Navigate to the Live Preview page. Check:
1. Left sidebar: Copilot section shows PRO badges on each command. Overlay section shows PRO badge and disabled toggles.
2. Left sidebar: "Tạo Video AI" is now two buttons — "Tạo Video Lip-sync" (normal) and "Tạo Video AI Động" (PRO badge).
3. Left sidebar: Asset cards have thumbnail area with duration badge.
4. Phone frame: "Xem PRO" button with glow pulse appears top-right (below sentiment card).
5. Clicking "Xem PRO" slides in mini PRO phone panel on the right.
6. Right chat panel: "AI Offline" with PRO badge instead of "AI Online".
7. Clicking any PRO badge opens the upsell modal with feature details and CTA.
8. Hovering over PRO badges shows tooltip with description + "Xem demo →" link.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(web-v2): polish PRO upsell visual issues"
```
