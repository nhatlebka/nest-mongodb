import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from './users.repository';

const UsersModelMock = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
};

describe('UsersRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken('USERS'),
          useValue: UsersModelMock,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  describe('find', () => {
    const query = {
      customerId: 1002,
    };

    it('find should return list users', async () => {
      UsersModelMock.find.mockImplementation((query) => {
        return {
          lean: () => {
            return {
              exec: () => {
                return [
                  {
                    _id: '624b9dba8d375f5afe5e2ce3',
                    username: 'user1',
                    customerId: 1002,
                    email: 'user1@email.com',
                  },
                ];
              },
            };
          },
        };
      });

      const rs = await userRepository.find(query);
      expect(UsersModelMock.find).toBeCalledWith(query);
      expect(rs[0].customerId).toEqual(1002);
      expect(rs[0].username).toEqual('user1');
    });

    it('find should throw error', async () => {
      UsersModelMock.find.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userRepository.find(query);
      } catch (error) {
        expect(UsersModelMock.find).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('findOne', () => {
    const query = {
      customerId: 1002,
    };

    it('find should return  oder', async () => {
      UsersModelMock.findOne.mockImplementation((query) => {
        return {
          exec: () => {
            return {
              _id: '624b9dba8d375f5afe5e2ce3',
              username: 'user1',
              customerId: 1002,
              email: 'user1@email.com',
            };
          },
        };
      });

      const rs = await userRepository.findOne(query);
      expect(UsersModelMock.findOne).toBeCalledWith(query);
      expect(rs.customerId).toEqual(1002);
      expect(rs.username).toEqual('user1');
    });

    it('findOne should throw error', async () => {
      UsersModelMock.findOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userRepository.findOne(query);
      } catch (error) {
        expect(UsersModelMock.findOne).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('update', () => {
    const query = {
      customerId: 1002,
    };

    const update = {
      email: 'update@gmail.com',
    };

    it('update should return oder have been updated', async () => {
      UsersModelMock.findOneAndUpdate.mockImplementation((query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          username: 'user1',
          customerId: 1002,
          email: 'update@gmail.com',
        };
      });

      const rs = await userRepository.update(query, update);
      expect(UsersModelMock.findOneAndUpdate).toBeCalledWith(query, update, {
        new: true,
      });
      expect(rs.email).toEqual('update@gmail.com');
    });

    it('update should throw error', async () => {
      UsersModelMock.findOneAndUpdate.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userRepository.update(query, update);
      } catch (error) {
        expect(UsersModelMock.findOneAndUpdate).toBeCalledWith(query, update, {
          new: true,
        });
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('delete', () => {
    const query = {
      customerId: 1002,
    };

    it('delete successfully', async () => {
      UsersModelMock.deleteOne.mockImplementation((query) => {
        return {
          deletedCount: 1,
        };
      });

      const rs = await userRepository.delete(query);
      expect(UsersModelMock.deleteOne).toBeCalledWith(query);
      expect(rs.deletedCount).toEqual(1);
    });

    it('delete should throw error', async () => {
      UsersModelMock.deleteOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await userRepository.delete(query);
      } catch (error) {
        expect(UsersModelMock.deleteOne).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });
});
