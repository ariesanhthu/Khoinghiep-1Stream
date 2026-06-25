CREATE TYPE "public"."platform" AS ENUM('youtube', 'tiktok', 'facebook', 'shopee');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('scheduled', 'live', 'ended');--> statement-breakpoint
CREATE TYPE "public"."stream_platform_status" AS ENUM('connecting', 'live', 'error', 'ended');--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"platform_user_id" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"is_bot" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livestream_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"status" "session_status" DEFAULT 'scheduled' NOT NULL,
	"rtmp_input_key" varchar(255) NOT NULL,
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"auto_reply_enabled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "livestream_sessions_rtmp_input_key_unique" UNIQUE("rtmp_input_key")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"platform_order_id" varchar(255),
	"product_name" varchar(500) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"buyer_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp with time zone,
	"platform_user_id" varchar(255),
	"platform_username" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"platform_connection_id" uuid NOT NULL,
	"rtmp_url" text NOT NULL,
	"stream_key" text NOT NULL,
	"status" "stream_platform_status" DEFAULT 'connecting' NOT NULL,
	"platform_broadcast_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"avatar" text,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_livestream_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."livestream_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livestream_sessions" ADD CONSTRAINT "livestream_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_session_id_livestream_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."livestream_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_connections" ADD CONSTRAINT "platform_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_platforms" ADD CONSTRAINT "session_platforms_session_id_livestream_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."livestream_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_platforms" ADD CONSTRAINT "session_platforms_platform_connection_id_platform_connections_id_fk" FOREIGN KEY ("platform_connection_id") REFERENCES "public"."platform_connections"("id") ON DELETE cascade ON UPDATE no action;