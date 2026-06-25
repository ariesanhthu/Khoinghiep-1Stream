import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const jwt = await this.authService.generateJwt(req.user as any)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:43100'
    res.redirect(`${frontendUrl}/dashboard?token=${jwt}`)
  }

  @Get('bypass')
  async bypassAuth(@Req() req: Request, @Res() res: Response) {
    const mockUser = {
      email: 'dev@sea.com',
      name: 'Developer Mode',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev',
    }
    const jwt = await this.authService.generateJwt(mockUser)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:43100'
    res.redirect(`${frontendUrl}/dashboard?token=${jwt}`)
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: Request) {
    return req.user
  }
}
