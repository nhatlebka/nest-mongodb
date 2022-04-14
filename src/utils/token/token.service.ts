import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signJwt(payload: any, jwtSignOptions?: JwtSignOptions) {
    return this.jwtService.sign(payload, jwtSignOptions);
  }

  verifyJwt(jwtToken: string, jwtVerifyOptions?: JwtVerifyOptions) {
    return this.jwtService.verify(jwtToken, jwtVerifyOptions);
  }
}
