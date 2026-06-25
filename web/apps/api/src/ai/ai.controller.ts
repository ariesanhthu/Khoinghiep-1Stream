import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AiService } from './ai.service'
import type { AiSuggestRequest } from '@sea/contracts'

@Controller('api/ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  suggest(@Body() body: AiSuggestRequest) {
    return this.aiService.suggest(body)
  }
}
