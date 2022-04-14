import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

import { HttpException } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { TokenService } from '@utils/token/token.service';

const UsersServiceMock = {
  getUser: jest.fn(),
  createUser: jest.fn(),
};

const TokenServiceMock = {
  signJwt: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, TokenService],
    })
      .overrideProvider(UsersService)
      .useValue(UsersServiceMock)
      .overrideProvider(TokenService)
      .useValue(TokenServiceMock)
      .compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });
  describe('signin', () => {
    const data = {
      username: 'user1',
      password: 'password',
    };

    it('signin should return accessToken', async () => {
      UsersServiceMock.getUser.mockImplementation(() => {
        return {
          username: 'user1',
          password: 'password',
          customerId: 1002,
          email: 'user1@example.com',
        };
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation((pass, hash) => {
        return true;
      });

      TokenServiceMock.signJwt.mockImplementation((payload) => {
        return 'vkdnxlajflkjsdfk';
      });

      const rs = await authService.signin(data);

      expect(UsersServiceMock.getUser).toBeCalledWith(data.username);
      expect(TokenServiceMock.signJwt).toBeCalledWith({
        username: 'user1',
        customerId: 1002,
      });
      expect(rs.assetToken).toEqual('vkdnxlajflkjsdfk');
    });

    it("signin should throw error 'Credential incorrect'", async () => {
      UsersServiceMock.getUser.mockImplementation(() => {
        return {
          username: 'user1',
          password: 'password',
          customerId: 1002,
          email: 'user1@example.com',
        };
      });

      jest.spyOn(bcrypt, 'compare').mockImplementation((pass, hash) => {
        return false;
      });

      try {
        await authService.signin(data);
      } catch (error) {
        expect(UsersServiceMock.getUser).toBeCalledWith(data.username);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Credential incorrect');
      }
    });

    it("signin should throw error 'Username does not exist'", async () => {
      UsersServiceMock.getUser.mockImplementation(() => {
        return null;
      });

      try {
        await authService.signin(data);
      } catch (error) {
        expect(UsersServiceMock.getUser).toBeCalledWith(data.username);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Username does not exist');
      }
    });
  });

  describe('signup', () => {
    const data = {
      username: 'user1',
      password: 'password',
      customerId: 1002,
      email: 'user1@example.com',
    };

    it('signup should create new user successfully', async () => {
      UsersServiceMock.createUser.mockImplementation((data) => {
        return {
          username: 'user1',
          password: 'password',
          customerId: 1002,
          email: 'user1@example.com',
        };
      });

      const rs = await authService.signup(data);

      expect(UsersServiceMock.createUser).toBeCalledWith(data);
      expect(rs.username).toBe('user1');
      expect(rs.customerId).toBe(1002);
    });

    it('signup should throw error', async () => {
      UsersServiceMock.createUser.mockImplementation((data) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await authService.signup(data);
      } catch (error) {
        expect(UsersServiceMock.createUser).toBeCalledWith(data);
        expect(error.status).toBe(500);
        expect(error.message).toContain('Internal server error');
      }
    });
  });
});
