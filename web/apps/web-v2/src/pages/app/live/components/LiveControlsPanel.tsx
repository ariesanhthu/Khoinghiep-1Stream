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
    { label: 'Ticker tuyển sinh', value: showTicker, toggle: () => setShowTicker(!showTicker) },
    { label: 'Trạng thái dữ liệu', value: showSentimentCard, toggle: () => setShowSentimentCard(!showSentimentCard) },
  ]

  return (
    <div className="shrink-0 border-b border-border px-4 py-3 space-y-3">
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Palette className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hiệu ứng khung hình</span>
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

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Mic className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Âm lượng giọng</span>
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
