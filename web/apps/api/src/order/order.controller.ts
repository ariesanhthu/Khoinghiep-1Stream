import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrderService } from './order.service'
import { Request } from 'express'

@Controller('api/orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('session/:sessionId')
  getBySession(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit: string = '50',
    @Req() req: Request,
  ) {
    return this.orderService.getBySession(sessionId, parseInt(limit, 10))
  }
}
