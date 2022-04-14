import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '@users/users.dto';
import { UsersService } from '@users/users.service';
import { TokenService } from '@utils/token/token.service';
import * as bcrypt from 'bcrypt';

import { AuthSigninDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async signin(data: AuthSigninDto): Promise<any> {
    const user = await this.usersService.getUser(data.username);
    if (user) {
      const isPass = bcrypt.compare(data.password, user.password);

      if (isPass) {
        return {
          assetToken: this.tokenService.signJwt({
            username: user.username,
            customerId: user.customerId,
          }),
        };
      } else {
        throw new UnauthorizedException('Credential incorrect');
      }
    } else {
      throw new UnauthorizedException('Username does not exist');
    }
  }

  async signup(data: UserDto) {
    const user = this.usersService.createUser(data);
    return user;
  }
}
