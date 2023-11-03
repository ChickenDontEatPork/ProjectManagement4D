import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { Users } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt.secret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: { sub: string; role: string }): Promise<Users> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });
      if (user) return user;
      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
