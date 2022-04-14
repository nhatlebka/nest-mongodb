import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { HttpException } from '@nestjs/common';

const userRepositoryMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
};

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)
      .compile();

    userService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const data = {
      username: 'user1',
      password: 'password',
      email: 'email@gmail.com',
      customerId: 1002,
    };

    it('createUser user successfully', async () => {
      userRepositoryMock.create.mockImplementation(() => {
        return {
          _id: 'asdav',
          username: 'user1',
          password: 'asdadasdasdasd',
          email: 'email@gmail.com',
          customerId: 1002,
        };
      });

      const rs = await userService.createUser(data);

      expect(userRepositoryMock.create).toBeCalled();
      expect(rs.customerId).toBe(1002);
      expect(rs.password).toBe('asdadasdasdasd');
    });

    it('createUser user should throw error', async () => {
      userRepositoryMock.create.mockImplementation(() => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userService.createUser(data);
      } catch (error) {
        expect(userRepositoryMock.create).toBeCalled();
        expect(error.message).toBe('Internal server error');
        expect(error.status).toBe(500);
      }
    });
  });

  describe('getUsers', () => {
    const query = {};

    it('getUsers user successfully', async () => {
      userRepositoryMock.find.mockImplementation(() => {
        return [
          {
            _id: 'asdav',
            username: 'user1',
            password: 'asdadasdasdasd',
            email: 'email@gmail.com',
            customerId: 1002,
          },
        ];
      });

      const rs = await userService.getUsers(query);

      expect(userRepositoryMock.find).toBeCalledWith(query);
      expect(rs[0].customerId).toBe(1002);
      expect(rs[0].password).toBe('asdadasdasdasd');
    });

    it('getUsers user should throw error', async () => {
      userRepositoryMock.create.mockImplementation(() => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userService.getUsers(query);
      } catch (error) {
        expect(userRepositoryMock.find).toBeCalledWith(query);
        expect(error.message).toBe('Internal server error');
        expect(error.status).toBe(500);
      }
    });
  });

  describe('getUser', () => {
    const username = 'user1';

    it('getUser user successfully', async () => {
      userRepositoryMock.findOne.mockImplementation(() => {
        return {
          _id: 'asdav',
          username: 'user1',
          password: 'asdadasdasdasd',
          email: 'email@gmail.com',
          customerId: 1002,
        };
      });

      const rs = await userService.getUser(username);

      expect(userRepositoryMock.findOne).toBeCalledWith({ username });
      expect(rs.customerId).toBe(1002);
      expect(rs.password).toBe('asdadasdasdasd');
    });

    it('getUser user should throw error', async () => {
      userRepositoryMock.findOne.mockImplementation(() => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userService.getUser(username);
      } catch (error) {
        expect(userRepositoryMock.findOne).toBeCalledWith({ username });
        expect(error.message).toBe('Internal server error');
        expect(error.status).toBe(500);
      }
    });
  });
});
