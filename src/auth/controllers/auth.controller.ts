import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuardGuard } from 'src/guards';
import { LoginAuthDto, RegisterAuthDto } from '../dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@ApiBearerAuth()
//@UseGuards(JwtGuardGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  handleRegister(@Body() registerBody: RegisterAuthDto) {
    return this.authService.register(registerBody);
  }

  @Post('login')
  handleLogin(@Body() loginBody: LoginAuthDto) {
    return this.authService.login(loginBody);
  }
}
