import type { Plan, Product, Voice, ModelAsset, Platform } from '@/types'
import { PLATFORM_META } from '@/types'

export const SEED_PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    priceMonthly: 99000,
    model: 'lip-sync',
    maxVideosPerMonth: 30,
    maxDurationMin: 5,
    quality: '720p',
    maxConcurrentPlatforms: 2,
    features: [
      'Mô hình Lip-sync (đổi khẩu hình)',
      '30 video / tháng',
      'Thời lượng tối đa 5 phút',
      'Chất lượng 720p',
      'Live tối đa 2 nền tảng đồng thời',
      '5 giọng nói mẫu',
      'AI trả lời bình luận cơ bản',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 399000,
    model: 'veo3',
    maxVideosPerMonth: null,
    maxDurationMin: 30,
    quality: '2K',
    maxConcurrentPlatforms: 4,
    features: [
      'Mô hình VEO3 (generate lại video)',
      'Video không giới hạn',
      'Thời lượng tối đa 30 phút',
      'Chất lượng 2K',
      'Live cả 4 nền tảng đồng thời',
      'Giọng nói không giới hạn + clone giọng',
      'AI trả lời bình luận nâng cao',
      'Không watermark',
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
      'Mô hình thiết kế riêng',
      'Thời lượng tối đa 60 phút',
      'Live không giới hạn nền tảng',
      'Ưu tiên xử lý băng thông cao',
      'Clone giọng nói & hình ảnh độc quyền',
      'AI trả lời bình luận thông minh',
      'Hỗ trợ kỹ thuật 24/7 chuyên nghiệp',
    ],
  },
]

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`

export const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Serum dưỡng trắng Vitamin C', description: 'Serum dưỡng trắng da, mờ thâm, cấp ẩm sâu.', price: 350000, images: [img('serum1'), img('serum2')], createdAt: new Date().toISOString() },
  { id: 'p2', name: 'Nồi chiên không dầu 5L', description: 'Nồi chiên không dầu dung tích 5L, tiết kiệm điện.', price: 1290000, images: [img('airfryer1')], createdAt: new Date().toISOString() },
  { id: 'p3', name: 'Áo khoác nỉ unisex', description: 'Áo khoác nỉ form rộng, chất liệu cotton dày dặn.', price: 259000, images: [img('jacket1'), img('jacket2')], createdAt: new Date().toISOString() },
  { id: 'p4', name: 'Tai nghe Bluetooth TWS', description: 'Tai nghe không dây chống ồn, pin 30 giờ.', price: 490000, images: [img('earbuds1')], createdAt: new Date().toISOString() },
]

export const SEED_VOICES: Voice[] = [
  { id: 'v1', name: 'Minh Anh (Nữ - Bắc)', gender: 'female', language: 'Tiếng Việt', sampleUrl: '', durationSec: 12, createdAt: new Date().toISOString() },
  { id: 'v2', name: 'Quốc Bảo (Nam - Bắc)', gender: 'male', language: 'Tiếng Việt', sampleUrl: '', durationSec: 10, createdAt: new Date().toISOString() },
  { id: 'v3', name: 'Thuý Vy (Nữ - Nam)', gender: 'female', language: 'Tiếng Việt', sampleUrl: '', durationSec: 14, createdAt: new Date().toISOString() },
  { id: 'v4', name: 'Hoàng Long (Nam - Nam)', gender: 'male', language: 'Tiếng Việt', sampleUrl: '', durationSec: 11, createdAt: new Date().toISOString() },
]

export const SEED_MODELS: ModelAsset[] = [
  { id: 'm1', name: 'Người mẫu nữ - Studio', kind: 'image', url: img('model1'), thumbnail: img('model1'), createdAt: new Date().toISOString() },
  { id: 'm2', name: 'Người mẫu nam - Casual', kind: 'image', url: img('model2'), thumbnail: img('model2'), createdAt: new Date().toISOString() },
  { id: 'm3', name: 'Người mẫu nữ - Ngoài trời', kind: 'image', url: img('model3'), thumbnail: img('model3'), createdAt: new Date().toISOString() },
  { id: 'm4', name: 'Người mẫu nam - Văn phòng', kind: 'image', url: img('model4'), thumbnail: img('model4'), createdAt: new Date().toISOString() },
  { id: 'm5', name: 'Clip giới thiệu nữ', kind: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: img('vid1'), createdAt: new Date().toISOString() },
  { id: 'm6', name: 'Clip giới thiệu nam', kind: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: img('vid2'), createdAt: new Date().toISOString() },
]

export const SEED_PLATFORMS: Platform[] = (Object.keys(PLATFORM_META) as Array<keyof typeof PLATFORM_META>).map((id) => ({
  id,
  name: PLATFORM_META[id].name,
  connected: false,
}))
