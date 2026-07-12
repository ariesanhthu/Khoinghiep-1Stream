import type { LucideIcon } from 'lucide-react'
import { formatVND } from '@/lib/utils'
import type { Product } from '@/types'

export type Sentiment = 'hot' | 'warm' | 'neutral'
export type CameraFilter = 'none' | 'retro' | 'cool' | 'glow' | 'bw'

export interface ChatItem {
  id: number
  name: string
  text: string
  intent: string
  answer: string
  sentiment: Sentiment
}

export type AssetType = 'image' | 'video'

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
  videoSrc?: string
  type?: AssetType
  productLabel?: string
  tier?: 'goc' | 'free' | 'pro'
  gradientFrom?: string
  gradientTo?: string
}

export const SHOPPERS = [
  'Hoàng Nam', 'Minh Thư', 'Lê Tuyết', 'Bảo Anh',
  'Thanh Vy', 'Gia Hân', 'Quốc Bảo', 'Mai Linh',
]

export const SAMPLE_COMMENTS = [
  'Em mất gốc thì có học lớp này được không ạ?',
  'Học phí khóa này bao nhiêu vậy trung tâm?',
  'Lớp sắp tới khai giảng ngày nào ạ?',
  'Có lớp học cuối tuần không trung tâm?',
  'Mình muốn đăng ký kiểm tra đầu vào ạ',
  'Khóa này có buổi học thử không?',
  'Học online hay tại trung tâm vậy ạ?',
  'Cho mình xin lộ trình học chi tiết nhé',
]

export const MANUAL_QUESTIONS = [
  'Em mất gốc thì có học lớp này được không?',
  'Lớp sắp tới khai giảng ngày nào ạ?',
  'Mình muốn đăng ký học thử thì làm sao?',
]

export const FALLBACK_PRODUCT: Product = {
  id: 'preview-product',
  name: 'IELTS Foundation 5.5',
  description: 'Lộ trình 12 tuần cho học viên đầu vào IELTS 3.0–3.5.',
  price: 3900000,
  images: ['/images/education/teacher-laptop.webp'],
  createdAt: new Date().toISOString(),
}

export const FILTER_LABELS: { value: CameraFilter; label: string }[] = [
  { value: 'none', label: 'Bình thường' },
  { value: 'retro', label: 'Retro Gold' },
  { value: 'cool', label: 'Cool Tech' },
  { value: 'glow', label: 'Beauty Glow' },
  { value: 'bw', label: 'Drama B&W' },
]

export const COPILOT_COMMANDS = [
  { label: '📣 Mời đăng ký học thử', prompt: 'Mời người xem để lại từ khóa HỌC THỬ để nhận biểu mẫu đăng ký và lịch tư vấn phù hợp.' },
  { label: '🗓️ Nhắc lịch khai giảng', prompt: 'Thông báo ngày khai giảng 28/07, lịch học thứ 3-5-7 và lưu ý số lượng chỗ của lớp.' },
  { label: '🎓 Giới thiệu lộ trình', prompt: 'Tóm tắt lộ trình 12 tuần, yêu cầu đầu vào IELTS 3.0–3.5 và mục tiêu nền tảng 5.5.' },
  { label: '💬 Đọc bình luận mới nhất', prompt: 'Đọc bình luận mới nhất và trả lời trong phạm vi dữ liệu tuyển sinh đã được trung tâm duyệt.' },
]

export function detectIntent(text: string) {
  if (/(học phí|bao nhiêu|giảm|ưu đãi|đóng phí)/i.test(text)) return 'Học phí & ưu đãi'
  if (/(khai giảng|lịch học|cuối tuần|thứ mấy|online|tại trung tâm)/i.test(text)) return 'Lịch & hình thức học'
  if (/(mất gốc|đầu vào|trình độ|lộ trình|đầu ra|phù hợp)/i.test(text)) return 'Tư vấn khóa học'
  if (/(học thử|kiểm tra|đăng ký|tư vấn|liên hệ|giữ chỗ)/i.test(text)) return 'Lead tuyển sinh'
  return 'Tương tác'
}

export function buildAnswer(text: string, product: Product) {
  if (/(học phí|bao nhiêu|đóng phí)/i.test(text)) {
    return `Học phí ${product.name} hiện được duyệt là ${formatVND(product.price)}. Chính sách ưu đãi sẽ áp dụng đúng theo thời hạn trung tâm công bố.`
  }
  if (/(giảm|ưu đãi)/i.test(text)) {
    return 'Trung tâm đang có ưu đãi đăng ký sớm theo thông tin đã duyệt. Tư vấn viên sẽ xác nhận mức áp dụng trước khi bạn đóng học phí.'
  }
  if (/(khai giảng|lịch học|cuối tuần|thứ mấy)/i.test(text)) {
    return 'Lớp gần nhất khai giảng ngày 28/07, học thứ 3-5-7 từ 19:00 đến 20:30. Hiện cũng có ca cuối tuần để bạn đăng ký tư vấn.'
  }
  if (/(online|tại trung tâm|offline)/i.test(text)) {
    return 'Khóa có lớp trực tiếp tại cơ sở Quận 3. Hình thức online được mở theo từng đợt; tư vấn viên sẽ kiểm tra lịch phù hợp cho bạn.'
  }
  if (/(mất gốc|đầu vào|trình độ|lộ trình|đầu ra|phù hợp)/i.test(text)) {
    return 'Khóa phù hợp với đầu vào khoảng IELTS 3.0–3.5. Bạn nên làm bài kiểm tra miễn phí; tư vấn viên sẽ xác nhận lớp phù hợp sau khi có kết quả.'
  }
  if (/(học thử|kiểm tra|đăng ký|tư vấn|liên hệ|giữ chỗ)/i.test(text)) {
    return 'Bạn có thể để lại từ khóa HỌC THỬ để nhận biểu mẫu. 1Stream chỉ ghi nhận thông tin liên hệ khi bạn đồng ý và sẽ chuyển cho tư vấn viên.'
  }
  return 'Cảm ơn bạn đã quan tâm. 1Stream đã ghi nhận câu hỏi; nếu nội dung nằm ngoài dữ liệu được duyệt, tư vấn viên của trung tâm sẽ hỗ trợ thêm.'
}

export function toChatItem(text: string, index: number, product: Product): ChatItem {
  const intent = detectIntent(text)
  const hasBuyingSignal = /học phí|học thử|kiểm tra|đăng ký|tư vấn|giữ chỗ/i.test(text)
  return {
    id: index,
    name: SHOPPERS[index % SHOPPERS.length],
    text,
    intent,
    answer: buildAnswer(text, product),
    sentiment: hasBuyingSignal ? 'hot' : intent === 'Tương tác' ? 'neutral' : 'warm',
  }
}

export function getFilterClass(filter: CameraFilter) {
  switch (filter) {
    case 'retro': return 'sepia-[0.4] saturate-[1.3] contrast-[0.95] brightness-[1.02]'
    case 'cool': return 'contrast-[1.12] brightness-[1.04] saturate-[1.08] hue-rotate-[8deg]'
    case 'glow': return 'brightness-[1.12] saturate-[1.1] contrast-[1.05] blur-[0.15px]'
    case 'bw': return 'grayscale-[1] contrast-[1.25] brightness-[0.98]'
    default: return ''
  }
}
