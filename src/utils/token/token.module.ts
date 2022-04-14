import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from '../../common/const';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
