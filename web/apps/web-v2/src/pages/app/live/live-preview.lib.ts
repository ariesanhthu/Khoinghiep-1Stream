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
  'Sản phẩm này dùng cho da nhạy cảm được không?',
  'Giá hôm nay bao nhiêu vậy shop?',
  'Shop có ship Hà Nội không ạ?',
  'Mua 2 hũ có giảm thêm không?',
  'Còn hàng không shop ơi?',
  'Chốt đơn ở đâu vậy ạ?',
  'Nhìn mẫu đang dùng thấy mê quá',
  'Có freeship trong live không shop?',
]

export const MANUAL_QUESTIONS = [
  'Sản phẩm này dùng cho da nhạy cảm được không?',
  'Shop có ship Hà Nội không ạ?',
  'Mua 2 có giảm thêm không?',
]

export const FALLBACK_PRODUCT: Product = {
  id: 'preview-product',
  name: 'Gel tẩy da chết cà phê Đắk Lắk',
  description: 'Sản phẩm demo cho livestream preview.',
  price: 125000,
  images: [],
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
  { label: '📣 Kêu gọi chốt đơn', prompt: 'Kêu gọi khách hàng nhấn vào giỏ hàng bên dưới để chốt sản phẩm với mã giảm giá độc quyền ngay lập tức.' },
  { label: '🎁 Promo Voucher 50K', prompt: 'Thông báo tặng ngay Voucher giảm 50.000đ dành riêng cho 10 khách hàng đầu tiên bình luận mã "LIVE50".' },
  { label: '⚡ Kể câu chuyện vui', prompt: 'Kể một mẩu truyện hài hước ngắn về thói quen chăm sóc da của các chị em để tạo tiếng cười trong phòng live.' },
  { label: '💬 Đọc bình luận mới nhất', prompt: 'Đọc to bình luận mới nhất của khách hàng và giải đáp thắc mắc của họ bằng giọng điệu ngọt ngào.' },
]

export function detectIntent(text: string) {
  if (/(giá|bao nhiêu|mua 2|giảm|combo|mã|freeship)/i.test(text)) return 'Giá & ưu đãi'
  if (/(ship|hà nội|miền bắc|sài gòn|order|đặt|chốt)/i.test(text)) return 'Vận chuyển'
  if (/(da|bầu|trẻ em|an toàn|mặt|dùng được)/i.test(text)) return 'Tư vấn sản phẩm'
  if (/(hàng|chính hãng|hạn sử dụng|có hàng|hết hàng|còn hàng)/i.test(text)) return 'Tồn kho'
  return 'Tương tác'
}

export function buildAnswer(text: string, product: Product) {
  if (/(giá|bao nhiêu)/i.test(text)) {
    return `${product.name} đang có giá ${formatVND(product.price)}. Trong live này khách chốt đơn được áp mã freeship và quà mini size.`
  }
  if (/(mua 2|combo|giảm|mã|freeship)/i.test(text)) {
    return 'Có nha, mua combo trong live sẽ được ưu đãi riêng. Agent đã ghim mã ở giỏ hàng để khách chốt ngay.'
  }
  if (/(ship|hà nội|miền bắc|sài gòn|order|đặt|chốt)/i.test(text)) {
    return 'Shop giao toàn quốc. Nội thành thường 1-2 ngày, các tỉnh khoảng 2-4 ngày, có COD và theo dõi vận đơn.'
  }
  if (/(da nhạy cảm|nhạy cảm|mặt|an toàn|bầu|trẻ em|dùng được)/i.test(text)) {
    return 'Sản phẩm ưu tiên dùng nhẹ 1-2 lần mỗi tuần. Da nhạy cảm nên test vùng nhỏ trước khi dùng toàn mặt.'
  }
  if (/(hàng|chính hãng|hạn sử dụng|có hàng|hết hàng|còn hàng)/i.test(text)) {
    return 'Hàng chính hãng, lô mới còn hạn dài. Hiện còn sẵn hàng trong kho live, agent có thể giữ đơn ngay.'
  }
  return 'Cảm ơn bạn đã tương tác. Agent đã ghi nhận câu hỏi và sẽ nhắc lại ưu đãi phù hợp trong live.'
}

export function toChatItem(text: string, index: number, product: Product): ChatItem {
  const intent = detectIntent(text)
  const hasBuyingSignal = /giá|mua|ship|order|đặt|giảm|combo|có hàng|chốt|freeship/i.test(text)
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
