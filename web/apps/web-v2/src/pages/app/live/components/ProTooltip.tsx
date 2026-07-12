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
    description: 'Kích hoạt các đoạn kịch bản tuyển sinh đã duyệt và đọc bình luận mới nhất.',
  },
  'auto-reply': {
    title: 'AI Tự Trả Lời',
    description: 'AI nhận diện FAQ tuyển sinh, trả lời trong phạm vi dữ liệu và chuyển người thật khi cần.',
  },
  'overlay': {
    title: 'Overlay tuỳ chỉnh',
    description: 'Tùy chỉnh watermark trung tâm và ticker lịch khai giảng.',
  },
  'video-ai': {
    title: 'Video AI Động',
    description: 'Tạo video tuyển sinh từ kịch bản, giọng đọc, avatar và tài sản đã duyệt.',
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
