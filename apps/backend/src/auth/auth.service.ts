import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  async verifySupabaseOtpAndUpsertUser(idToken: string, name?: string, emailArg?: string) {
    try {
      const decodedToken = this.jwtService.verify(idToken, {
        secret: process.env.SUPABASE_JWT_SECRET,
      });
      const email = decodedToken.email || emailArg;

      if (!email) {
        throw new UnauthorizedException('No email attached to this token');
      }

      let user = await this.prisma.user.findFirst({
        where: { email },
      });

      let isNewUser = false;
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            mobile: `auth_${Date.now()}_${Math.floor(Math.random()*1000)}`, // Dummy mobile to satisfy Prisma constraint
            email,
            role: 'CUSTOMER',
            ...(name && { name }),
          },
        });
        isNewUser = true;
      } else if (!user.name && name) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { name },
        });
      }

      const payload = { sub: user.id, role: user.role };
      
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        user,
        accessToken,
        refreshToken,
        isNewUser,
      };
    } catch (error) {
      console.error('Supabase token verification error', error);
      throw new UnauthorizedException('Invalid or expired Supabase ID token');
    }
  }

  async refreshToken(refreshTokenString: string) {
    try {
      const decoded = this.jwtService.verify(refreshTokenString);
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) throw new UnauthorizedException('User not found');

      const payload = { sub: user.id, role: user.role };
      
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        user,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
