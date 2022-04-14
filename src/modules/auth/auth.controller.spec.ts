import { JwtStrategy } from '@guards/strategy/jwt.strategy';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


const AuthServiceMock = {
  signin: jest.fn(),
  signup: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    })
      .overrideProvider(AuthService)
      .useValue(AuthServiceMock)
      .compile();

    authController = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('signin', () => {
    const data = {
      username: 'user1',
      password: 'password',
    };

    it('signin should return accessToken!', async () => {
      AuthServiceMock.signin.mockImplementation(() => {
        return {
          assetToken: 'sdasdasdasdv',
        };
      });

      const rs = await authController.signin(data);

      expect(AuthServiceMock.signin).toBeCalledWith(data);
      expect(rs.assetToken).toEqual('sdasdasdasdv');
    });

    it('signin should throw error !', async () => {
      AuthServiceMock.signin.mockImplementation(() => {
        throw new UnauthorizedException('Credential incorrect');
      });

      try {
        await authController.signin(data);
      } catch (error) {
        expect(AuthServiceMock.signin).toBeCalledWith(data);
        expect(error.status).toEqual(401);
        expect(error.message).toEqual('Credential incorrect');
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

    it('signup successfully!', async () => {
      AuthServiceMock.signup.mockImplementation(() => {
        return {
          username: 'user1',
          password: 'password',
          customerId: 1002,
          email: 'user1@example.com',
        };
      });

      const rs = await authController.signup(data);

      expect(AuthServiceMock.signup).toBeCalledWith(data);
      expect(rs.email).toEqual('user1@example.com');
      expect(rs.username).toEqual('user1');
    });

    it('signup should throw error !', async () => {
      AuthServiceMock.signup.mockImplementation(() => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await authController.signup(data);
      } catch (error) {
        expect(AuthServiceMock.signup).toBeCalledWith(data);
        expect(error.status).toEqual(500);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });
});
