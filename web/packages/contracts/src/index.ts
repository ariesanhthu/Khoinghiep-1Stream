export type Platform = 'youtube' | 'tiktok' | 'facebook' | 'shopee'

export type SessionStatus = 'scheduled' | 'live' | 'ended'

export type StreamPlatformStatus = 'connecting' | 'live' | 'error' | 'ended'

export type ChatMessageSource = 'user' | 'bot' | 'system'

export interface StartStreamCommand {
  sessionId: string
  platforms: Array<{
    platformConnectionId: string
    rtmpUrl: string
    streamKey: string
  }>
  rtmpInputKey: string
}

export interface StreamStatusEvent {
  sessionId: string
  status: StreamPlatformStatus
  platformConnectionId?: string
  error?: string
}

export interface LivestreamSession {
  id: string
  userId: string
  title: string
  status: SessionStatus
  rtmpInputKey: string
  scheduledAt: Date | null
  startedAt: Date | null
  endedAt: Date | null
  createdAt: Date
}

export interface SessionPlatform {
  id: string
  sessionId: string
  platformConnectionId: string
  rtmpUrl: string
  streamKey: string
  status: StreamPlatformStatus
  platformBroadcastId: string | null
}

export interface PlatformConnection {
  id: string
  userId: string
  platform: Platform
  platformUserId: string | null
  platformUsername: string | null
  createdAt: Date
}

export interface ChatMessage {
  id: string
  sessionId: string
  platform: Platform
  platformUserId: string
  username: string
  content: string
  isBot: boolean
  timestamp: Date
}

export interface IncomingChatMessage {
  sessionId: string
  platform: Platform
  platformUserId: string
  username: string
  content: string
}

export interface AutoReplyToggleDto {
  enabled: boolean
  productContext?: string
}

export interface BotReplyEvent {
  id: string
  sessionId: string
  replyTo: string
  content: string
  timestamp: Date
}

export interface Order {
  id: string
  sessionId: string
  platform: Platform
  platformOrderId: string | null
  productName: string
  quantity: number
  price: string
  status: string
  buyerName: string | null
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  createdAt: Date
}

export interface JwtPayload {
  sub: string
  email: string
}

export interface CreateSessionDto {
  title: string
  scheduledAt?: string
  platforms: Array<{
    platformConnectionId: string
    rtmpUrl: string
    streamKey: string
  }>
}

export interface AiSuggestRequest {
  sessionId: string
  comment: string
  productContext?: string
}

export interface AiSuggestResponse {
  suggestion: string
}

export const RABBITMQ_QUEUES = {
  START_STREAM: 'stream.start',
  STOP_STREAM: 'stream.stop',
  STREAM_STATUS: 'stream.status',
} as const

export const RABBITMQ_EXCHANGES = {
  STREAM: 'stream.exchange',
} as const
