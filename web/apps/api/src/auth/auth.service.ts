import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { db } from '@sea/database'
import { users } from '@sea/database'
import { eq } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: { email: string; name: string; avatar?: string }) {
    let [existing] = await db.select().from(users).where(eq(users.email, user.email))

    if (!existing) {
      ;[existing] = await db
        .insert(users)
        .values({
          id: uuid(),
          email: user.email,
          name: user.name,
          avatar: user.avatar ?? null,
        })
        .returning()
    }

    return this.jwtService.sign({ sub: existing.id, email: existing.email })
  }
}
