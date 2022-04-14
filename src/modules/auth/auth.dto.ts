import { ApiProperty } from '@nestjs/swagger';

export class AuthSigninDto {
  @ApiProperty({ example: 'user1' })
  username: string;
  @ApiProperty({ example: 'password1' })
  password: string;
}
