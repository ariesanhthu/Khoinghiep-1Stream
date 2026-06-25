import { Injectable, NotFoundException } from '@nestjs/common'
import { db } from '@sea/database'
import { livestreamSessions, sessionPlatforms } from '@sea/database'
import { eq, and } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'
import type { CreateSessionDto, StartStreamCommand, AutoReplyToggleDto, RABBITMQ_QUEUES } from '@sea/contracts'
import { RabbitmqService } from '../rabbitmq/rabbitmq.service'

@Injectable()
export class SessionService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  async list(userId: string) {
    return db
      .select()
      .from(livestreamSessions)
      .where(eq(livestreamSessions.userId, userId))
  }

  async get(id: string, userId: string) {
    const [session] = await db
      .select()
      .from(livestreamSessions)
      .where(and(eq(livestreamSessions.id, id), eq(livestreamSessions.userId, userId)))
    if (!session) throw new NotFoundException()
    const platforms = await db
      .select()
      .from(sessionPlatforms)
      .where(eq(sessionPlatforms.sessionId, id))
    return { ...session, platforms }
  }

  async create(userId: string, dto: CreateSessionDto) {
    const sessionId = uuid()
    const rtmpInputKey = `live_${sessionId.substring(0, 8)}`

    const [session] = await db
      .insert(livestreamSessions)
      .values({
        id: sessionId,
        userId,
        title: dto.title,
        rtmpInputKey,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      })
      .returning()

    if (dto.platforms?.length) {
      await db.insert(sessionPlatforms).values(
        dto.platforms.map((p) => ({
          id: uuid(),
          sessionId,
          platformConnectionId: p.platformConnectionId,
          rtmpUrl: p.rtmpUrl,
          streamKey: p.streamKey,
        })),
      )
    }

    return this.get(sessionId, userId)
  }

  async start(id: string, userId: string) {
    const sessionData = await this.get(id, userId)

    const command: StartStreamCommand = {
      sessionId: id,
      platforms: sessionData.platforms.map((p) => ({
        platformConnectionId: p.platformConnectionId,
        rtmpUrl: p.rtmpUrl,
        streamKey: p.streamKey,
      })),
      rtmpInputKey: sessionData.rtmpInputKey,
    }

    await this.rabbitmqService.publish('stream.start', command)

    await db
      .update(livestreamSessions)
      .set({ status: 'live', startedAt: new Date() })
      .where(eq(livestreamSessions.id, id))

    return { ...sessionData, status: 'live' }
  }

  async stop(id: string, userId: string) {
    await this.get(id, userId)
    await db
      .update(livestreamSessions)
      .set({ status: 'ended', endedAt: new Date() })
      .where(eq(livestreamSessions.id, id))
    await db
      .update(sessionPlatforms)
      .set({ status: 'ended' })
      .where(eq(sessionPlatforms.sessionId, id))
    return { stopped: true }
  }

  async toggleAutoReply(id: string, userId: string, dto: AutoReplyToggleDto) {
    await this.get(id, userId)
    await db
      .update(livestreamSessions)
      .set({ autoReplyEnabled: dto.enabled })
      .where(eq(livestreamSessions.id, id))
    return { autoReplyEnabled: dto.enabled }
  }

  async remove(id: string, userId: string) {
    await this.get(id, userId)
    await db.delete(livestreamSessions).where(eq(livestreamSessions.id, id))
    return { deleted: true }
  }
}
