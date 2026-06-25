import { Module, forwardRef } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { SessionModule } from '../session/session.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [forwardRef(() => SessionModule), forwardRef(() => AiModule)],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
