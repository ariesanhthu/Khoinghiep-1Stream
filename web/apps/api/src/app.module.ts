import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './auth/auth.module'
import { PlatformModule } from './platform/platform.module'
import { SessionModule } from './session/session.module'
import { ChatModule } from './chat/chat.module'
import { OrderModule } from './order/order.module'
import { AiModule } from './ai/ai.module'
import { RabbitmqModule } from './rabbitmq/rabbitmq.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    PlatformModule,
    SessionModule,
    ChatModule,
    OrderModule,
    AiModule,
    RabbitmqModule,
  ],
})
export class AppModule {}
