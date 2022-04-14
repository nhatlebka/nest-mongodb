import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

const JwtServiceMock = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('UsersService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, JwtService],
    })
      .overrideProvider(JwtService)
      .useValue(JwtServiceMock)
      .compile();

    tokenService = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });

  describe('signJwt', () => {
    const payload = {
      username: 'user1',
      customerId: 1002,
    };

    it('signJwt should return token', () => {
      JwtServiceMock.sign.mockImplementation((payload) => {
        return 'sadadasdadasdas';
      });

      const rs = tokenService.signJwt(payload);

      expect(JwtServiceMock.sign).toBeCalledWith(payload, undefined);
      expect(rs).toEqual('sadadasdadasdas');
    });
  });

  describe('verifyJwt', () => {
    const token = 'sadadasdadasdas';

    it('verifyJwt should return token', () => {
      JwtServiceMock.verify.mockImplementation((payload) => {
        return {
          username: 'user1',
          customerId: 1002,
        };
      });

      const rs = tokenService.verifyJwt(token);

      expect(JwtServiceMock.verify).toBeCalledWith(token, undefined);
      expect(rs).toEqual({
        username: 'user1',
        customerId: 1002,
      });
    });
  });
});
