import { JwtPayload } from '@/shared/interfaces/jwt.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtToken } from './dtos/jwt.dto';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateJwt(
    payload: JwtPayload,
    register = false,
  ): Promise<JwtToken> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * this.configService.get<number>('jwt.expire'),
      secret: this.configService.get<string>('jwt.secret'),
    });
    return { accessToken: token, register: register };
  }

  private client() {
    return new OAuth2Client(
      this.configService.get<string>('google.clientId'),
      this.configService.get<string>('google.secret'),
    );
  }

  private async verifyToken(idToken: string) {
    const client = this.client();
    return await client.verifyIdToken({
      idToken: idToken,
      audience: this.configService.get<string>('google.clientId'),
    });
  }

  async signIn(loginDto: LoginDto) {
    try {
      const token = await this.verifyToken(loginDto.credential);
      if (!token) throw new InternalServerErrorException();
      const email = token.getPayload().email;
      const user = await this.prisma.users.findUnique({
        where: { email: email },
      });
      if (!user) return this.signUp(token);
      const register = user.register;
      return this.generateJwt({ sub: user.id, role: user.role }, register);
    } catch (err) {
      return err.response;
    }
  }

  async signUp(payload: LoginTicket) {
    const data = payload.getPayload();
    const newUser = {
      email: data.email,
      image: data.picture,
    };
    const user = await this.prisma.users.create({ data: newUser });
    return this.generateJwt({ sub: user.id, role: user.role }, user.register);
  }
}
