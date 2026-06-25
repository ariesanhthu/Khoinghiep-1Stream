import { Injectable } from '@nestjs/common'
import { db } from '@sea/database'
import { orders } from '@sea/database'
import { eq, desc } from 'drizzle-orm'

@Injectable()
export class OrderService {
  async getBySession(sessionId: string, limit: number) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.sessionId, sessionId))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
  }
}
