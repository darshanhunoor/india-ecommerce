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

  async verifyFirebaseOtpAndUpsertUser(idToken: string) {
    try {
      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(idToken);
      const mobile = decodedToken.phone_number;

      if (!mobile) {
        throw new UnauthorizedException('No phone number attached to this token');
      }

      let user = await this.prisma.user.findUnique({
        where: { mobile },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            mobile,
            role: 'CUSTOMER',
          },
        });
      }

      const payload = { sub: user.id, role: user.role };
      
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Firebase token verification error', error);
      throw new UnauthorizedException('Invalid or expired Firebase ID token');
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
