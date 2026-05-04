import { Controller, Post, Body, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-otp')
  async verifyOtp(
    @Body('idToken') idToken: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response
  ) {
    if (!idToken) throw new UnauthorizedException('ID token is required');
    
    const { user, accessToken, refreshToken, isNewUser } = await this.authService.verifySupabaseOtpAndUpsertUser(idToken, name, email);
    this.setCookies(res, accessToken, refreshToken);

    return { user, isNewUser };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rfToken = req.cookies['refresh_token'];
    if (!rfToken) throw new UnauthorizedException('No refresh token found in cookies');

    const { user, accessToken, refreshToken } = await this.authService.refreshToken(rfToken);
    this.setCookies(res, accessToken, refreshToken);

    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth/refresh', // send refresh token only to auth/refresh
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
}
