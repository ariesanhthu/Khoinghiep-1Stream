import type { Plan, Product, Voice, ModelAsset, Platform } from '@/types'
import { PLATFORM_META } from '@/types'

export const SEED_PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'AI Agent Basic',
    priceMonthly: 399000,
    model: 'lip-sync',
    maxVideosPerMonth: 30,
    maxDurationMin: 5,
    quality: '720p',
    maxConcurrentPlatforms: 2,
    features: [
      'Kết nối 1 kênh',
      '200 lượt phản hồi AI / tháng',
      'Cơ sở tri thức khóa học đã duyệt',
      'Trả lời FAQ tuyển sinh',
      'Ghi nhận và chuyển lead',
      'Báo cáo lượt tương tác',
    ],
  },
  {
    id: 'pro',
    name: 'AI Agent Growth',
    priceMonthly: 799000,
    model: 'veo3',
    maxVideosPerMonth: null,
    maxDurationMin: 30,
    quality: '2K',
    maxConcurrentPlatforms: 3,
    features: [
      'Kết nối tối đa 3 kênh',
      '1.000 lượt phản hồi AI / tháng',
      'FAQ đa kênh theo dữ liệu đã duyệt',
      'Phân loại nhu cầu học',
      'Chuyển tư vấn viên khi cần',
      'Báo cáo tổng hợp',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 0,
    model: 'veo3',
    maxVideosPerMonth: null,
    maxDurationMin: 60,
    quality: '2K',
    maxConcurrentPlatforms: 4,
    features: [
      'Nhiều kênh hoặc chi nhánh',
      'Cơ sở tri thức riêng',
      'Phân quyền theo vai trò',
      'Tích hợp CRM theo phạm vi',
      'Hạn mức và SLA tùy chỉnh',
      'Hỗ trợ vận hành theo yêu cầu',
    ],
  },
]

export const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'IELTS Foundation 5.5', description: 'Lộ trình 12 tuần cho học viên đầu vào IELTS 3.0–3.5. Khai giảng 28/07.', price: 3900000, images: ['/images/education/teacher-laptop.webp'], createdAt: new Date().toISOString() },
  { id: 'p2', name: 'TOPIK I — Tiếng Hàn sơ cấp', description: 'Khóa 36 buổi cho người mới bắt đầu, có lớp cuối tuần.', price: 2800000, images: ['/images/education/language-classroom.webp'], createdAt: new Date().toISOString() },
  { id: 'p3', name: 'Tiếng Anh giao tiếp phản xạ', description: 'Lộ trình 10 tuần, học thử 60 phút và đánh giá phát âm miễn phí.', price: 2400000, images: ['/images/education/language-classroom.webp'], createdAt: new Date().toISOString() },
]

export const SEED_VOICES: Voice[] = [
  { id: 'v1', name: 'Minh Anh (Nữ - Bắc)', gender: 'female', language: 'Tiếng Việt', sampleUrl: '', durationSec: 12, createdAt: new Date().toISOString() },
  { id: 'v2', name: 'Quốc Bảo (Nam - Bắc)', gender: 'male', language: 'Tiếng Việt', sampleUrl: '', durationSec: 10, createdAt: new Date().toISOString() },
  { id: 'v3', name: 'Thuý Vy (Nữ - Nam)', gender: 'female', language: 'Tiếng Việt', sampleUrl: '', durationSec: 14, createdAt: new Date().toISOString() },
  { id: 'v4', name: 'Hoàng Long (Nam - Nam)', gender: 'male', language: 'Tiếng Việt', sampleUrl: '', durationSec: 11, createdAt: new Date().toISOString() },
]

export const SEED_MODELS: ModelAsset[] = [
  { id: 'm1', name: 'Tư vấn viên AI — Studio', kind: 'image', url: '/images/education/ai-advisor-live-v1.webp', thumbnail: '/images/education/ai-advisor-live-v1.webp', createdAt: new Date().toISOString() },
  { id: 'm2', name: 'Giảng viên — Bảng lớp học', kind: 'image', url: '/images/education/teacher-laptop.webp', thumbnail: '/images/education/teacher-laptop.webp', createdAt: new Date().toISOString() },
  { id: 'm3', name: 'Không gian lớp ngoại ngữ', kind: 'image', url: '/images/education/language-classroom.webp', thumbnail: '/images/education/language-classroom.webp', createdAt: new Date().toISOString() },
  { id: 'm4', name: 'Video tư vấn tuyển sinh mẫu', kind: 'video', url: '/videos/video_free.mp4', thumbnail: '/videos/thumbs/free.jpg', createdAt: new Date().toISOString() },
]

export const SEED_PLATFORMS: Platform[] = (Object.keys(PLATFORM_META) as Array<keyof typeof PLATFORM_META>).map((id) => ({
  id,
  name: PLATFORM_META[id].name,
  connected: false,
}))
