export type PlatformId = 'tiktok' | 'facebook' | 'youtube'

export interface Platform {
  id: PlatformId
  name: string
  connected: boolean
  account?: string
  connectedAt?: string
}

export type PlanId = 'standard' | 'pro' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  priceMonthly: number
  model: 'lip-sync' | 'veo3'
  maxVideosPerMonth: number | null
  maxDurationMin: number
  quality: '720p' | '1080p' | '2K'
  maxConcurrentPlatforms: number
  features: string[]
}

export interface Subscription {
  planId: PlanId
  trialEndsAt: string
  videosUsed: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  createdAt: string
}

export interface Voice {
  id: string
  name: string
  gender: 'male' | 'female'
  language: string
  sampleUrl: string
  durationSec: number
  createdAt: string
}

export type ModelKind = 'image' | 'video'

export interface ModelAsset {
  id: string
  name: string
  kind: ModelKind
  url: string
  thumbnail: string
  createdAt: string
}

export interface Comment {
  id: string
  platform: PlatformId
  author: string
  avatar: string
  text: string
  createdAt: string
  aiReplied: boolean
  aiReply?: string
}

export interface LiveConfig {
  platforms: PlatformId[]
  productId: string
  voiceId: string
  modelId: string
}

export const PLATFORM_META: Record<PlatformId, { name: string; color: string; short: string }> = {
  tiktok: { name: 'TikTok Shop', color: '#ff0050', short: 'TT' },
  facebook: { name: 'Facebook', color: '#1877f2', short: 'FB' },
  youtube: { name: 'YouTube', color: '#ff0000', short: 'YT' },
  // shopee: { name: 'Shopee Live', color: '#ee4d2d', short: 'SP' },
}
