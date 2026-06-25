import { Injectable, NotFoundException } from '@nestjs/common'
import { db } from '@sea/database'
import { platformConnections } from '@sea/database'
import { eq, and } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'
import type { Platform } from '@sea/contracts'

@Injectable()
export class PlatformService {
  async listConnections(userId: string) {
    return db
      .select({
        id: platformConnections.id,
        platform: platformConnections.platform,
        platformUsername: platformConnections.platformUsername,
        createdAt: platformConnections.createdAt,
      })
      .from(platformConnections)
      .where(eq(platformConnections.userId, userId))
  }

  async getConnectUrl(userId: string, platform: Platform) {
    const oauthUrls: Record<Platform, string> = {
      youtube: 'https://accounts.google.com/o/oauth2/v2/auth',
      tiktok: 'https://www.tiktok.com/v2/auth/authorize',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      shopee: 'https://partner.shopeemobile.com/api/v2/shop/auth_partner',
    }
    return { url: oauthUrls[platform], platform }
  }

  async handleCallback(userId: string, platform: Platform, query: Record<string, string>) {
    const [existing] = await db
      .select()
      .from(platformConnections)
      .where(
        and(
          eq(platformConnections.userId, userId),
          eq(platformConnections.platform, platform),
        ),
      )

    if (existing) {
      await db
        .update(platformConnections)
        .set({
          accessToken: query.code ?? 'placeholder',
          platformUsername: `${platform}_user_${Date.now()}`,
        })
        .where(eq(platformConnections.id, existing.id))
      return
    }

    await db.insert(platformConnections).values({
      id: uuid(),
      userId,
      platform,
      accessToken: query.code ?? 'placeholder',
      platformUsername: `${platform}_user_${Date.now()}`,
    })
  }

  async removeConnection(id: string, userId: string) {
    const [conn] = await db
      .select()
      .from(platformConnections)
      .where(and(eq(platformConnections.id, id), eq(platformConnections.userId, userId)))
    if (!conn) throw new NotFoundException()
    await db.delete(platformConnections).where(eq(platformConnections.id, id))
    return { deleted: true }
  }
}
