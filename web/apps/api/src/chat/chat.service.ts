import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { db } from '@sea/database'
import { chatMessages, livestreamSessions } from '@sea/database'
import { eq, and, desc } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'
import type { Platform, ChatMessage, IncomingChatMessage } from '@sea/contracts'
import { SessionGateway } from '../session/session.gateway'
import { AiService } from '../ai/ai.service'

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => SessionGateway))
    private readonly gateway: SessionGateway,
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService,
  ) {}

  async getMessages(sessionId: string, userId: string, limit: number, offset: number) {
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit)
      .offset(offset)
  }

  private async insertMessage(
    sessionId: string,
    platform: Platform,
    platformUserId: string,
    username: string,
    content: string,
    isBot = false,
  ) {
    const [msg] = await db
      .insert(chatMessages)
      .values({
        id: uuid(),
        sessionId,
        platform,
        platformUserId,
        username,
        content,
        isBot,
      })
      .returning()
    return msg
  }

  async handleIncomingMessage(msg: IncomingChatMessage): Promise<ChatMessage> {
    const saved = await this.insertMessage(
      msg.sessionId,
      msg.platform,
      msg.platformUserId,
      msg.username,
      msg.content,
    )

    this.gateway.broadcastToSession(saved.sessionId, 'chat:message', saved)

    const [session] = await db
      .select({ autoReplyEnabled: livestreamSessions.autoReplyEnabled })
      .from(livestreamSessions)
      .where(eq(livestreamSessions.id, saved.sessionId))

    if (session?.autoReplyEnabled) {
      const ai = await this.aiService.suggest({
        sessionId: saved.sessionId,
        comment: saved.content,
      })

      const botMsg = await this.insertMessage(
        saved.sessionId,
        saved.platform,
        'ai-bot',
        'AI Assistant',
        ai.suggestion,
        true,
      )

      this.gateway.broadcastToSession(saved.sessionId, 'chat:bot-reply', botMsg)
    }

    return saved
  }

  async sendHostMessage(sessionId: string, userId: string, content: string) {
    const msg = await this.insertMessage(
      sessionId,
      'youtube' as Platform,
      userId,
      'Host',
      content,
    )

    this.gateway.broadcastToSession(sessionId, 'chat:message', msg)
    return msg
  }
}
