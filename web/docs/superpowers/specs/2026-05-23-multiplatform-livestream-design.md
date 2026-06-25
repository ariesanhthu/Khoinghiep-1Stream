# Multi-Platform Livestream Sales — Design Spec

**Date:** 2026-05-23  
**Scope:** Full turborepo init (new project, clean history)  
**Platforms:** TikTok Shop, YouTube, Facebook/Instagram, Shopee Live

---

## 1. Architecture

### Turborepo Structure

```
sea-hackathon-2026/web/
├── apps/
│   ├── api/          # NestJS 10 — HTTP + WebSocket, port 43101
│   ├── web/          # Next.js 15 App Router, port 43100
│   └── streamer/     # NestJS worker — FFmpeg manager, port 43102
├── packages/
│   ├── database/     # Drizzle ORM — shared Postgres schema + migrations
│   └── contracts/    # Shared TypeScript types and DTOs
├── docker-compose.yml
├── turbo.json
└── package.json      # pnpm workspace root
```

### Port Assignments

| Service            | Port  |
|--------------------|-------|
| web (Next.js)      | 43100 |
| api (NestJS)       | 43101 |
| streamer (NestJS)  | 43102 |
| Postgres           | 54320 |
| RabbitMQ AMQP      | 56720 |
| RabbitMQ Mgmt UI   | 56721 |
| LocalStack (S3)    | 45760 |
| RTMP input         | 19450 |

### Communication

- `web` ↔ `api`: REST + WebSocket (Socket.IO)
- `api` → `streamer`: RabbitMQ (stream start/stop commands)
- `streamer` → `api`: RabbitMQ (stream status events)
- `api` → `ai-service`: HTTP (Python service, separate repo)

---

## 2. Data Models (Drizzle / Postgres)

```sql
users
  id uuid PK, email, name, avatar, passwordHash?, createdAt

platform_connections
  id uuid PK
  userId uuid FK → users
  platform  enum('youtube','tiktok','facebook','shopee')
  accessToken, refreshToken, expiresAt
  platformUserId, platformUsername
  createdAt

livestream_sessions
  id uuid PK, userId uuid FK
  title, status enum('scheduled','live','ended')
  rtmpInputKey  -- unique key for FFmpeg RTMP input
  scheduledAt, startedAt, endedAt

session_platforms
  id uuid PK
  sessionId uuid FK → livestream_sessions
  platformConnectionId uuid FK → platform_connections
  rtmpUrl, streamKey       -- platform RTMP destination
  status enum('connecting','live','error','ended')
  platformBroadcastId      -- ID returned by platform API

chat_messages
  id uuid PK, sessionId uuid FK
  platform, platformUserId, username
  content, timestamp

orders
  id uuid PK, sessionId uuid FK
  platform, platformOrderId
  productName, quantity, price, status
  buyerName, createdAt
```

### Shared Contracts (packages/contracts)

```ts
export type Platform = 'youtube' | 'tiktok' | 'facebook' | 'shopee'
export type SessionStatus = 'scheduled' | 'live' | 'ended'
export type StreamPlatformStatus = 'connecting' | 'live' | 'error' | 'ended'

// RabbitMQ message shapes
export interface StartStreamCommand {
  sessionId: string
  platforms: Array<{ platformConnectionId: string; rtmpUrl: string; streamKey: string }>
  rtmpInputKey: string
}
export interface StreamStatusEvent {
  sessionId: string
  status: StreamPlatformStatus
  platformConnectionId?: string
  error?: string
}
```

---

## 3. App Modules

### api (NestJS)

| Module    | Responsibility |
|-----------|---------------|
| auth      | Google OAuth login, JWT issue/refresh |
| platform  | Per-user OAuth connect/disconnect for each platform, token refresh |
| session   | Livestream session CRUD, start/stop orchestration |
| chat      | WebSocket gateway, platform chat polling worker |
| order     | Aggregate orders from platforms, WebSocket push |
| ai        | Proxy to ai-service for comment suggestions |

### web (Next.js App Router)

| Route              | Purpose |
|--------------------|---------|
| /                  | Landing / login |
| /dashboard         | Session list, stats overview |
| /studio/[id]       | Live control: chat, orders, AI suggestions, stream health |
| /sessions/new      | Create/schedule session, pick platforms |
| /settings/platforms| OAuth connect/disconnect per platform |

### streamer (NestJS worker)

| Module      | Responsibility |
|-------------|---------------|
| rtmp        | Accept RTMP input on port 19450, validate stream key |
| ffmpeg      | Spawn/manage FFmpeg processes per session, monitor health |
| rabbitmq    | Consume StartStreamCommand, publish StreamStatusEvent |

---

## 4. Key Flows

### Platform OAuth (per user)

```
GET  /api/platform/connect/:platform  → redirect to platform OAuth
     /api/platform/callback/:platform → save tokens to platform_connections
                                       → redirect /settings/platforms
DELETE /api/platform/:id              → remove connection
```

### Start Livestream

```
POST /api/sessions/:id/start
  1. api resolves platform credentials for each session_platform
  2. publishes StartStreamCommand to RabbitMQ
  3. streamer spawns FFmpeg:
       ffmpeg -listen 1 -i rtmp://0.0.0.0:19450/<rtmpKey>
              -c copy -f flv <youtube_rtmp>
              -c copy -f flv <tiktok_rtmp>
              -c copy -f flv <facebook_rtmp>
              -c copy -f flv <shopee_rtmp>
  4. streamer publishes StreamStatusEvent back
  5. api updates session status → 'live'
  6. WebSocket push to web studio
```

### Chat Aggregation

- Polling worker in api (or streamer) calls each platform's chat API every 2s
- YouTube: YouTube Live Chat API (polling, 2s interval)
- TikTok/Facebook/Shopee: respective live comment APIs
- Normalize → insert `chat_messages` → WebSocket broadcast to studio

### AI Support

```
POST /api/ai/suggest  { sessionId, comment, productContext }
  → HTTP to ai-service (Python)
  → returns suggested reply text
  → studio displays suggestion; user sends or ignores
  → optional: auto-reply mode via streamer
```

---

## 5. Infrastructure (docker-compose.yml)

```yaml
services:
  postgres:   image: postgres:16,  port: 54320
  rabbitmq:   image: rabbitmq:3-management, ports: 56720, 56721
  localstack: image: localstack/localstack, port: 45760 (S3)
```

---

## 6. Out of Scope (MVP)

- Payment processing
- Product catalog management
- Stream recording / VOD storage
- Shopee Live API (include in OAuth UI, implement streaming later — API docs limited)
- Multi-tenant / team accounts
