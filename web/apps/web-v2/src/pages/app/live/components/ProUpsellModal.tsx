import { Play, Check } from 'lucide-react'
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
    title: 'AI Copilot — Trợ lý phiên tuyển sinh',
    description: 'Kích hoạt nhanh các đoạn kịch bản đã duyệt: mời học thử, nhắc lịch khai giảng, giới thiệu lộ trình và đọc bình luận mới.',
    highlights: ['4 lệnh copilot tùy chỉnh', 'Mời đăng ký học thử', 'Nhắc lịch và lộ trình', 'Đọc bình luận mới nhất'],
  },
  'auto-reply': {
    title: 'AI Tự Trả Lời — Không bỏ lỡ nhu cầu học',
    description: 'AI nhận diện câu hỏi về học phí, lịch khai giảng, đầu vào và học thử dựa trên cơ sở tri thức đã duyệt.',
    highlights: ['Trả lời FAQ theo dữ liệu', 'Phân loại nhu cầu học', 'Chuyển tư vấn viên khi cần', 'Hỗ trợ đa nền tảng'],
  },
  'overlay': {
    title: 'Overlay Chuyên Nghiệp',
    description: 'Tùy chỉnh watermark trung tâm và ticker lịch khai giảng chạy ngang để thông tin chính luôn dễ nhìn.',
    highlights: ['Watermark trung tâm', 'Ticker lịch khai giảng', 'Tuỳ chỉnh vị trí & màu sắc', 'Bật/tắt linh hoạt'],
  },
  'video-ai': {
    title: 'Video AI Động — Vượt xa Lip-sync',
    description: 'Tạo bản video tuyển sinh từ kịch bản, giọng đọc hoặc avatar, video nền và phụ đề để duyệt trước khi phát.',
    highlights: ['Kịch bản từ dữ liệu khóa học', 'Giọng đọc hoặc avatar', 'Video nền và phụ đề', 'Có bản xem trước'],
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
        <div className="relative h-[200px] bg-gradient-to-br from-[#1a1040] to-[#0d1025] flex flex-col items-center justify-center border-b border-border">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-500/20 border-2 border-violet-500/40 cursor-pointer hover:bg-violet-500/30 transition">
            <Play className="h-5 w-5 text-violet-500 ml-0.5" fill="currentColor" />
          </div>
          <p className="mt-2.5 text-[11px] text-violet-500/50 font-semibold">Bấm để xem demo {details.title.split('—')[0].trim()}</p>
          <span className="absolute top-3 right-3 bg-gradient-to-r from-violet-500 to-purple-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full tracking-wide">
            TÍNH NĂNG NÂNG CAO
          </span>
        </div>
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
              Mở demo Growth — {proPlan ? formatVND(proPlan.priceMonthly) : '799.000₫'}/tháng
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
