# Unified Chat Feed + AI Auto-Reply — Implementation Plan

**Date:** 2026-05-23  
**Feature:** Gộp comment từ nhiều platform thành 1 luồng chat duy nhất + AI trả lời tự động  
**Scope:** 4 layers — Database, Contracts, API, Web

---

## Tổng quan flow

```
[YouTube comment] ──┐
[TikTok comment] ───┤
[Facebook comment]──┤──▶ ChatService.handleIncomingMessage()
[Shopee comment] ───┘         │
                              ├── 1. Insert vào DB
                              ├── 2. Broadcast WebSocket `chat:message` → Studio
                              ├── 3. Nếu autoReply ON:
                              │      ├── Gọi AiService.suggest()
                              │      ├── Insert bot reply vào DB (isBot=true)
                              │      └── Broadcast WebSocket `chat:bot-reply`
                              └── 4. Return message
```

---

## 1. Database Changes

**File:** `packages/database/src/schema.ts`

### 1.1 Thêm cột `is_bot` vào `chat_messages`

```ts
// Thêm vào chatMessages table
isBot: boolean('is_bot').notNull().default(false),
```

Mục đích: Phân biệt message từ user thật vs AI bot reply. Frontend render khác nhau (badge "AI", màu khác).

### 1.2 Thêm cột `auto_reply_enabled` vào `livestream_sessions`

```ts
// Thêm vào livestreamSessions table
autoReplyEnabled: boolean('auto_reply_enabled').notNull().default(false),
```

Mục địch: Toggle auto-reply per session. Host bật/tắt trong studio.

### 1.3 Re-generate migration

```bash
pnpm --filter @sea/database db:generate
```

---

## 2. Contracts Changes

**File:** `packages/contracts/src/index.ts`

### 2.1 Thêm types mới

```ts
export type ChatMessageSource = 'user' | 'bot' | 'system'

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
```

### 2.2 Mở rộng `ChatMessage`

```ts
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
```

---

## 3. API Changes

### 3.1 ChatService — Core logic

**File:** `apps/api/src/chat/chat.service.ts`

Thay đổi:
- Inject `SessionGateway` (forwardRef) để broadcast WebSocket
- Inject `AiService` (forwardRef) để gọi AI khi auto-reply ON
- Inject DB query cho `livestreamSessions.autoReplyEnabled`

```ts
// Pseudocode flow:
async handleIncomingMessage(msg: IncomingChatMessage): Promise<ChatMessage> {
  // 1. Insert message vào DB (isBot=false)
  const saved = await this.insertMessage(msg)
  
  // 2. Broadcast chat:message qua WebSocket
  this.gateway.broadcastToSession(saved.sessionId, 'chat:message', saved)
  
  // 3. Check auto-reply
  const session = await db.query autoReplyEnabled cho sessionId
  if (session.autoReplyEnabled) {
    // 3a. Gọi AI
    const ai = await this.aiService.suggest({
      sessionId: saved.sessionId,
      comment: saved.content,
      productContext: session.productContext,
    })
    
    // 3b. Insert bot reply
    const botMsg = await this.insertMessage({
      sessionId: saved.sessionId,
      platform: saved.platform,
      platformUserId: 'ai-bot',
      username: 'AI Assistant',
      content: ai.suggestion,
      isBot: true,
    })
    
    // 3c. Broadcast bot reply
    this.gateway.broadcastToSession(saved.sessionId, 'chat:bot-reply', botMsg)
  }
  
  return saved
}
```

### 3.2 ChatController — Thêm endpoints

**File:** `apps/api/src/chat/chat.controller.ts`

Thêm 2 endpoints:

```ts
// POST /api/chat/incoming — Nhận message từ platform polling workers (hoặc test)
@Post('incoming')
async incoming(@Body() body: IncomingChatMessage, @Req() req: Request) {
  return this.chatService.handleIncomingMessage(body)
}

// POST /api/chat/send — Host gửi tin nhắn từ studio
@Post('send')
async send(@Body() body: { sessionId: string; content: string }, @Req() req: Request) {
  return this.chatService.sendHostMessage(
    body.sessionId,
    (req.user as any).id,
    body.content,
  )
}
```

### 3.3 SessionController — Auto-reply toggle

**File:** `apps/api/src/session/session.controller.ts`

Thêm endpoint:

```ts
// POST /api/sessions/:id/auto-reply — Toggle auto-reply on/off
@Post(':id/auto-reply')
toggleAutoReply(
  @Param('id') id: string,
  @Body() body: AutoReplyToggleDto,
  @Req() req: Request,
) {
  return this.sessionService.toggleAutoReply(id, (req.user as any).id, body)
}
```

### 3.4 SessionService — Auto-reply toggle

**File:** `apps/api/src/session/session.service.ts`

Thêm method:

```ts
async toggleAutoReply(id: string, userId: string, dto: AutoReplyToggleDto) {
  await this.get(id, userId) // verify ownership
  await db
    .update(livestreamSessions)
    .set({ autoReplyEnabled: dto.enabled })
    .where(eq(livestreamSessions.id, id))
  return { autoReplyEnabled: dto.enabled }
}
```

### 3.5 Module wiring — Circular dependency

**File:** `apps/api/src/chat/chat.module.ts`

ChatModule cần SessionGateway (từ SessionModule) + AiService (từ AiModule).

```ts
import { forwardRef } from '@nestjs/common'
import { SessionModule } from '../session/session.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [forwardRef(() => SessionModule), forwardRef(() => AiModule)],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
```

Trong ChatService inject bằng `@Inject(forwardRef(...))`:
```ts
constructor(
  @Inject(forwardRef(() => SessionGateway))
  private readonly gateway: SessionGateway,
  @Inject(forwardRef(() => AiService))
  private readonly aiService: AiService,
) {}
```

### 3.6 AiService — Thêm timeout

**File:** `apps/api/src/ai/ai.service.ts`

```ts
// Thêm AbortController timeout 10s
async suggest(req: AiSuggestRequest): Promise<AiSuggestResponse> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const response = await fetch(`${this.aiServiceUrl}/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return (await response.json()) as AiSuggestResponse
  } catch {
    return { suggestion: '[AI service unavailable]' }
  }
}
```

---

## 4. Web Changes

### 4.1 Socket client — Thêm auth + events

**File:** `apps/web/src/lib/socket.ts`

```ts
// Thêm auth token + reconnect config
export function getSocket(): Socket {
  if (!socket) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    socket = io(API_URL, {
      autoConnect: false,
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })
  }
  return socket
}
```

### 4.2 Studio Page — Complete rewrite

**File:** `apps/web/src/app/studio/[id]/page.tsx`

Layout 3 vùng:

```
┌───────────────────────────────────────────────────────────────────┐
│ Header: Title + Status + [Go Live] / [End Stream]                │
│         RTMP Key + Platform Status Badges                         │
│         [Auto-Reply Toggle] ← NẰM TRONG HEADER                   │
├──────────────────────────────┬────────────────────────────────────┤
│                              │                                    │
│  Unified Chat Feed           │  AI Reply Panel                   │
│  (tất cả platforms gộp lại) │                                    │
│                              │  - AI suggestion hiện tại          │
│  Platform badge trên mỗi msg │  - [Send] [Dismiss] buttons       │
│  YouTube=red, TikTok=cyan    │                                    │
│  Facebook=blue, Shopee=orange│  - Auto-reply status indicator     │
│                              │                                    │
│  Bot messages: badge "AI"    │  - Reply history (scrollable)      │
│  màu purple, khác background │                                    │
│                              │                                    │
│  [Input gửi tin nhắn]        │                                    │
│                              │                                    │
└──────────────────────────────┴────────────────────────────────────┘
```

Chi tiết UI components:

#### 4.2.1 Header Section
```
- Session title (h2)
- Status badge: scheduled/live/ended
- Go Live / End Stream button
- RTMP Key display + copy button
- Platform status badges (mỗi platform 1 badge với status)
- Auto-Reply toggle switch (nằm cùng hàng, bên phải)
  - Khi ON: green glow, "Auto-Reply ON"
  - Khi OFF: gray, "Auto-Reply OFF"
  - Click → POST /api/sessions/:id/auto-reply
```

#### 4.2.2 Unified Chat Feed (cột trái, flex-1)
```
- Scrollable list, newest at bottom
- Mỗi message:
  ┌─────────────────────────────────┐
  │ [YouTube] @username    2m ago   │
  │ Comment content here            │
  │ [✨ AI Reply] (hover visible)  │
  └─────────────────────────────────┘
  
  - Platform badge: pill màu platform
    YouTube → bg-red-600 text-white
    TikTok → bg-cyan-500 text-white
    Facebook → bg-blue-600 text-white
    Shopee → bg-orange-500 text-white
  - Username: font-medium
  - Content: text-gray-300
  - Hover → hiện nút "✨ AI Reply" (gợi ý thủ công)
  
- Bot reply message:
  ┌─────────────────────────────────┐
  │ 🤖 AI Assistant                 │
  │ AI-generated reply content      │
  │ (bg-purple-900/30 border-purple)│
  └─────────────────────────────────┘
  
  - Background: bg-purple-900/20 border-l-2 border-purple-500
  - Badge "AI" màu purple
  - Nội dung reply

- Auto-scroll: khi có tin nhắn mới → scroll to bottom
  Trừ khi user đang scroll lên xem tin cũ

- Bottom input bar:
  ┌─────────────────────────────────┐
  │ [Type a message...]    [Send]   │
  └─────────────────────────────────┘
  - Gửi message từ host → POST /api/chat/send
  - Message hiện trong feed với badge "Host"
```

#### 4.2.3 AI Reply Panel (cột phải, w-80)
```
┌────────────────────────────────────┐
│ AI Assistant                       │
│ ─────────────────────────────────  │
│ Auto-Reply: [ON/OFF toggle]        │
│                                    │
│ Current Suggestion:                │
│ ┌────────────────────────────────┐ │
│ │ "Cảm ơn bạn đã quan tâm!..."  │ │
│ └────────────────────────────────┘ │
│ [Send as reply] [Dismiss]          │
│                                    │
│ ─────────────────────────────────  │
│ Suggestion History:                │
│ - "Reply to @user1: ..."  ✓ Sent  │
│ - "Reply to @user2: ..."  ✓ Sent  │
│ - "Reply to @user3: ..."  ○ Skip  │
└────────────────────────────────────┘

- Auto-reply toggle: đồng bộ với header toggle
- Current suggestion:
  - Hiển thị khi user click "AI Reply" trên message
  - HOẶC tự động hiện khi auto-reply ON
  - 2 buttons: Send (gửi reply) / Dismiss (bỏ qua)
- Suggestion history:
  - List các suggestion đã generate
  - Status: Sent (green) / Skipped (gray) / Pending (yellow)
```

### 4.3 WebSocket event handling

```ts
// Trong useEffect:
socket.on('chat:message', (msg: ChatMessage) => {
  setMessages((prev) => [...prev, msg])  // append to end (newest last)
  scrollToBottom()                        // auto-scroll
})

socket.on('chat:bot-reply', (msg: ChatMessage) => {
  setMessages((prev) => [...prev, msg])  // bot reply also in feed
  setAiSuggestion('')                     // clear current suggestion
  addToHistory(msg)                       // add to AI panel history
})
```

---

## 5. Implementation Order

### Step 1: Database + Contracts (15 phút)
1. Thêm `isBot` vào `chatMessages` schema
2. Thêm `autoReplyEnabled` vào `livestreamSessions` schema
3. Thêm types mới vào contracts: `IncomingChatMessage`, `AutoReplyToggleDto`, `BotReplyEvent`
4. Cập nhật `ChatMessage` interface thêm `isBot`
5. Re-generate Drizzle migration

### Step 2: API — Session auto-reply toggle (15 phút)
1. `session.service.ts` → thêm `toggleAutoReply()` method
2. `session.controller.ts` → thêm `POST :id/auto-reply` endpoint
3. `session.module.ts` → export SessionService (cho ChatModule dùng)

### Step 3: API — ChatService core (30 phút)
1. `chat.module.ts` → import forwardRef SessionModule + AiModule
2. `chat.service.ts` → inject SessionGateway + AiService
3. `chat.service.ts` → thêm `handleIncomingMessage()` method
4. `chat.service.ts` → thêm `sendHostMessage()` method
5. `chat.controller.ts` → thêm POST `incoming` + POST `send` endpoints

### Step 4: API — AiService timeout (5 phút)
1. `ai.service.ts` → thêm AbortController 10s timeout

### Step 5: Web — Socket auth (10 phút)
1. `socket.ts` → thêm token auth + reconnect config

### Step 6: Web — Studio page rewrite (60 phút)
1. Layout 3 cột
2. Header với platform badges + auto-reply toggle
3. Unified chat feed với platform colors + bot messages
4. AI reply panel với suggestion + history
5. Chat input cho host
6. Auto-scroll logic
7. WebSocket event handlers

### Step 7: Build + Test (15 phút)
1. `pnpm turbo run build` — verify tất cả compile
2. Manual test flow: tạo session → Go Live → gửi message → verify auto-reply

---

## 6. Files to Modify (Summary)

| File | Action | Changes |
|------|--------|---------|
| `packages/database/src/schema.ts` | EDIT | +`isBot` col, +`autoReplyEnabled` col |
| `packages/contracts/src/index.ts` | EDIT | +3 new interfaces, update ChatMessage |
| `apps/api/src/chat/chat.service.ts` | REWRITE | inject gateway + AI, handleIncomingMessage |
| `apps/api/src/chat/chat.module.ts` | EDIT | +forwardRef imports |
| `apps/api/src/chat/chat.controller.ts` | EDIT | +POST incoming, +POST send |
| `apps/api/src/session/session.service.ts` | EDIT | +toggleAutoReply() |
| `apps/api/src/session/session.controller.ts` | EDIT | +POST :id/auto-reply |
| `apps/api/src/session/session.module.ts` | EDIT | export SessionService |
| `apps/api/src/ai/ai.service.ts` | EDIT | +timeout |
| `apps/web/src/lib/socket.ts` | EDIT | +auth +reconnect |
| `apps/web/src/app/studio/[id]/page.tsx` | REWRITE | Full 3-column layout |

---

## 7. API Endpoints Summary

| Method | Path | Purpose | New? |
|--------|------|---------|------|
| GET | `/api/chat/:sessionId` | Get paginated messages | Existing |
| POST | `/api/chat/incoming` | Platform message ingestion | **NEW** |
| POST | `/api/chat/send` | Host sends message from studio | **NEW** |
| POST | `/api/ai/suggest` | Manual AI suggestion | Existing |
| POST | `/api/sessions/:id/auto-reply` | Toggle auto-reply | **NEW** |

---

## 8. WebSocket Events Summary

| Event | Direction | Payload | New? |
|-------|-----------|---------|------|
| `join:session` | Client → Server | sessionId | Existing |
| `leave:session` | Client → Server | sessionId | Existing |
| `chat:message` | Server → Client | ChatMessage | **NEW** (wired) |
| `chat:bot-reply` | Server → Client | ChatMessage (isBot=true) | **NEW** |
| `stream:status` | Server → Client | StreamStatusEvent | Existing |

---

## 9. Testing Strategy

### Manual test flow:
1. Start infra: `pnpm infra:up`
2. Push DB schema: `pnpm --filter @sea/database db:push`
3. Start apps: `pnpm dev`
4. Open browser → sign in → create session with 1+ platforms
5. Go to Studio → toggle Auto-Reply ON
6. Simulate incoming message: `curl -X POST localhost:43101/api/chat/incoming -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"sessionId":"<id>","platform":"youtube","platformUserId":"user123","username":"TestUser","content":"Sản phẩm này giá bao nhiêu?"}'`
7. Verify: message appears in chat feed + AI auto-generates reply + bot reply appears below
8. Test manual "AI Reply" button → suggestion panel → send/dismiss
9. Toggle auto-reply OFF → verify no more auto-replies
