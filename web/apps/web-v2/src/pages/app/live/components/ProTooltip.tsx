import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
