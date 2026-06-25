import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PlatformService } from './platform.service'
import { Request, Response } from 'express'
import type { Platform } from '@sea/contracts'

@Controller('api/platform')
@UseGuards(AuthGuard('jwt'))
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  list(@Req() req: Request) {
    return this.platformService.listConnections((req.user as any).id)
  }

  @Get('connect/:platform')
  connect(@Param('platform') platform: Platform, @Req() req: Request) {
    return this.platformService.getConnectUrl(
      (req.user as any).id,
      platform,
    )
  }

  @Get('callback/:platform')
  async callback(
    @Param('platform') platform: Platform,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.platformService.handleCallback((req.user as any).id, platform, req.query as any)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:43100'
    res.redirect(`${frontendUrl}/settings/platforms`)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.platformService.removeConnection(id, (req.user as any).id)
  }
}
