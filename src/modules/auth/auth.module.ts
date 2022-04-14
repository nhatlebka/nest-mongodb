import { JwtStrategy } from '@guards/strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { TokenModule } from '@utils/token/token.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
