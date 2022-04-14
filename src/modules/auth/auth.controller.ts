import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from '@users/users.dto';
import { AuthSigninDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  async signin(@Body() data: AuthSigninDto) {
    const user = await this.authService.signin(data);

    return user;
  }

  @Post('signup')
  signup(@Body() data: UserDto) {
    return this.authService.signup(data);
  }
}
