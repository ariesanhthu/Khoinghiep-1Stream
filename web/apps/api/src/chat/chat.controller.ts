import { Controller, Get, Post, Param, Query, Body, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChatService } from './chat.service'
import { Request } from 'express'
import type { IncomingChatMessage } from '@sea/contracts'

@Controller('api/chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':sessionId')
  getMessages(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
    @Req() req: Request,
  ) {
    return this.chatService.getMessages(
      sessionId,
      (req.user as any).id,
      parseInt(limit, 10),
      parseInt(offset, 10),
    )
  }

  @Post('incoming')
  async incoming(@Body() body: IncomingChatMessage) {
    return this.chatService.handleIncomingMessage(body)
  }

  @Post('send')
  async send(@Body() body: { sessionId: string; content: string }, @Req() req: Request) {
    return this.chatService.sendHostMessage(
      body.sessionId,
      (req.user as any).id,
      body.content,
    )
  }
}
