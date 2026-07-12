import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { ContentAsset } from '../live-preview.lib'

export function AssetCard({
  asset,
  onGenerateFromSource,
}: {
  asset: ContentAsset
  onGenerateFromSource?: () => void
}) {
  const Icon = asset.icon
  const isImage = asset.type === 'image'
  const [imgError, setImgError] = useState(false)

  const thumbnailStyle = asset.gradientFrom
    ? { background: `linear-gradient(135deg, ${asset.gradientFrom} 0%, ${asset.gradientTo ?? '#000'} 100%)` }
    : undefined

  const showImg = !!asset.thumbnail && !imgError

  return (
    <div
      className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md ${asset.active ? 'border-blue-500 ring-2 ring-blue-500/10' : asset.muted ? 'border-slate-200 opacity-70' : 'border-slate-200 hover:border-blue-300'}`}
    >
      {/* Thumbnail area */}
      <div
        className="relative w-full aspect-video flex items-center justify-center overflow-hidden"
        style={thumbnailStyle ?? { background: 'linear-gradient(135deg, #1a1040 0%, #0d1025 100%)' }}
      >
        {showImg ? (
          <img
            src={asset.thumbnail}
            alt={asset.title}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Icon className={`h-6 w-6 ${isImage ? 'text-amber-400/50' : 'text-primary/40'}`} />
        )}

        {/* Hover overlay — use this asset for AI livestream generation */}
        {onGenerateFromSource && !asset.isCreating && (
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onGenerateFromSource() }}
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-md transition-colors shadow-lg"
            >
              <Sparkles className="h-2.5 w-2.5" />
              AI tạo live từ đây
            </button>
          </div>
        )}

        {/* Type badge: image vs video */}
        <span className={`absolute right-1.5 top-1.5 rounded px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wider text-white ${isImage ? 'bg-amber-500/90' : 'bg-blue-600/90'}`}>
          {isImage ? 'Ảnh' : 'Video'}
        </span>

        {/* Duration / count */}
        <span className="absolute bottom-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-bold text-white">
          {asset.isCreating ? '...' : asset.duration}
        </span>

        {asset.active && (
          <span className="absolute left-1.5 top-1.5 rounded bg-rose-500 px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wider text-white">
            Đang dùng
          </span>
        )}
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

      <div className="px-2.5 py-2.5">
        <p className="truncate text-[10px] font-bold text-slate-800">{asset.title}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">
          {asset.isCreating
            ? 'Đang tạo...'
            : asset.productLabel
              ? `${asset.productLabel} · ${asset.duration}`
              : `Nội dung · ${asset.duration}`}
        </p>
      </div>
    </div>
  )
}
