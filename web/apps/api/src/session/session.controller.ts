import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SessionService } from './session.service'
import { Request } from 'express'
import type { CreateSessionDto, AutoReplyToggleDto } from '@sea/contracts'

@Controller('api/sessions')
@UseGuards(AuthGuard('jwt'))
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  list(@Req() req: Request) {
    return this.sessionService.list((req.user as any).id)
  }

  @Get(':id')
  get(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.get(id, (req.user as any).id)
  }

  @Post()
  create(@Body() dto: CreateSessionDto, @Req() req: Request) {
    return this.sessionService.create((req.user as any).id, dto)
  }

  @Post(':id/start')
  start(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.start(id, (req.user as any).id)
  }

  @Post(':id/stop')
  stop(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.stop(id, (req.user as any).id)
  }

  @Post(':id/auto-reply')
  toggleAutoReply(
    @Param('id') id: string,
    @Body() body: AutoReplyToggleDto,
    @Req() req: Request,
  ) {
    return this.sessionService.toggleAutoReply(id, (req.user as any).id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sessionService.remove(id, (req.user as any).id)
  }
}
