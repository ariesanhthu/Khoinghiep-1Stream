import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core'

export const platformEnum = pgEnum('platform', ['youtube', 'tiktok', 'facebook', 'shopee'])
export const sessionStatusEnum = pgEnum('session_status', ['scheduled', 'live', 'ended'])
export const streamPlatformStatusEnum = pgEnum('stream_platform_status', ['connecting', 'live', 'error', 'ended'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: text('avatar'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const platformConnections = pgTable('platform_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: platformEnum('platform').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  platformUserId: varchar('platform_user_id', { length: 255 }),
  platformUsername: varchar('platform_username', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const livestreamSessions = pgTable('livestream_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  status: sessionStatusEnum('status').notNull().default('scheduled'),
  rtmpInputKey: varchar('rtmp_input_key', { length: 255 }).notNull().unique(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  autoReplyEnabled: boolean('auto_reply_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const sessionPlatforms = pgTable('session_platforms', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => livestreamSessions.id, { onDelete: 'cascade' }),
  platformConnectionId: uuid('platform_connection_id').notNull().references(() => platformConnections.id, { onDelete: 'cascade' }),
  rtmpUrl: text('rtmp_url').notNull(),
  streamKey: text('stream_key').notNull(),
  status: streamPlatformStatusEnum('status').notNull().default('connecting'),
  platformBroadcastId: varchar('platform_broadcast_id', { length: 255 }),
})

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => livestreamSessions.id, { onDelete: 'cascade' }),
  platform: platformEnum('platform').notNull(),
  platformUserId: varchar('platform_user_id', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isBot: boolean('is_bot').notNull().default(false),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => livestreamSessions.id, { onDelete: 'cascade' }),
  platform: platformEnum('platform').notNull(),
  platformOrderId: varchar('platform_order_id', { length: 255 }),
  productName: varchar('product_name', { length: 500 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  buyerName: varchar('buyer_name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
