import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let userController: UsersController;

  const usersServiceMock = {
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .compile();

    userController = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  describe('getUser', () => {
    const query = { customerId: 1002 };
    const req = {} as Request;

    it('getUser should return list user', async () => {
      usersServiceMock.getUsers.mockImplementation((query) => {
        return [
          {
            username: 'user1',
            customerId: 1002,
            email: 'user1@example.com',
          },
        ];
      });

      const rs = await userController.getUser(query, req);

      expect(usersServiceMock.getUsers).toBeCalledWith(query);
      expect(rs[0].username).toBe('user1');
      expect(rs[0].customerId).toBe(1002);
    });
  });
});
