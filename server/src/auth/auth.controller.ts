import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtToken } from './dtos/jwt.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async googleAuthCallback(@Body() loginDto: LoginDto): Promise<JwtToken> {
    const token = await this.authService.signIn(loginDto);
    console.log(token);
    return token;
  }
}
