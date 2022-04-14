import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { OderRepository } from './oders.repository';

const OderModelMock = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
};

describe('OdersRepository', () => {
  let oderRepository: OderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OderRepository,
        {
          provide: getModelToken('ODERS'),
          useValue: OderModelMock,
        },
      ],
    }).compile();

    oderRepository = module.get<OderRepository>(OderRepository);

    jest.clearAllMocks();
  });

  describe('find', () => {
    const query = {
      customerId: 1002,
    };

    it('find should return list oders', async () => {
      OderModelMock.find.mockImplementation((query) => {
        return {
          lean: () => {
            return {
              exec: () => {
                return [
                  {
                    _id: '624b9dba8d375f5afe5e2ce3',
                    customerId: 1002,
                    states: 'created',
                    totalAmount: 420000,
                  },
                ];
              },
            };
          },
        };
      });

      const rs = await oderRepository.find(query);
      expect(OderModelMock.find).toBeCalledWith(query);
      expect(rs[0].customerId).toEqual(1002);
    });

    it('find should throw error', async () => {
      OderModelMock.find.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.find(query);
      } catch (error) {
        expect(OderModelMock.find).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('findOne', () => {
    const query = {
      customerId: 1002,
    };

    it('find should return  oder', async () => {
      OderModelMock.findOne.mockImplementation((query) => {
        return {
          exec: () => {
            return {
              _id: '624b9dba8d375f5afe5e2ce3',
              customerId: 1002,
              states: 'created',
              totalAmount: 420000,
            };
          },
        };
      });

      const rs = await oderRepository.findOne(query);
      expect(OderModelMock.findOne).toBeCalledWith(query);
      expect(rs.customerId).toEqual(1002);
    });

    it('findOne should throw error', async () => {
      OderModelMock.findOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.findOne(query);
      } catch (error) {
        expect(OderModelMock.findOne).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('create', () => {
    const query = {
      customerId: 1002,
      states: 'created',
      totalAmount: 420000,
    };

    it('create should return new oder', async () => {
      OderModelMock.create.mockImplementation((query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'created',
          totalAmount: 420000,
        };
      });

      const rs = await oderRepository.create(query);

      expect(OderModelMock.create).toBeCalledWith(query);
      expect(rs).toEqual({
        _id: '624b9dba8d375f5afe5e2ce3',
        customerId: 1002,
        states: 'created',
        totalAmount: 420000,
      });
    });

    it('create should throw error', async () => {
      OderModelMock.create.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.create(query);
      } catch (error) {
        expect(OderModelMock.create).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('update', () => {
    const query = {
      customerId: 1002,
    };

    const update = {
      states: 'delivered',
    };

    it('update should return oder have been updated', async () => {
      OderModelMock.findOneAndUpdate.mockImplementation((query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'delivered',
          totalAmount: 420000,
        };
      });

      const rs = await oderRepository.update(query, update);
      expect(OderModelMock.findOneAndUpdate).toBeCalledWith(query, update, {
        new: true,
      });
      expect(rs.states).toEqual('delivered');
    });

    it('update should throw error', async () => {
      OderModelMock.findOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.update(query, update);
      } catch (error) {
        expect(OderModelMock.findOneAndUpdate).toBeCalledWith(query, update, {
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
      OderModelMock.deleteOne.mockImplementation((query) => {
        return {
          deletedCount: 1,
        };
      });

      const rs = await oderRepository.delete(query);
      expect(OderModelMock.deleteOne).toBeCalledWith(query);
      expect(rs.deletedCount).toEqual(1);
    });

    it('delete should throw error', async () => {
      OderModelMock.deleteOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.delete(query);
      } catch (error) {
        expect(OderModelMock.deleteOne).toBeCalledWith(query);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('cancelOder', () => {
    const oderId = '624b9dba8d375f5afe5e2ce3';

    it('cancelOder successfully', async () => {
      OderModelMock.findOneAndUpdate.mockImplementation((query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'cancelled',
          totalAmount: 420000,
        };
      });

      const rs = await oderRepository.cancelOder(oderId);

      expect(OderModelMock.findOneAndUpdate).toBeCalledWith(
        { _id: oderId },
        { states: 'cancelled' },
        { new: true },
      );
      expect(rs.states).toEqual('cancelled');
    });

    it('cancelOder should throw error', async () => {
      OderModelMock.findOneAndUpdate.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.cancelOder(oderId);
      } catch (error) {
        expect(OderModelMock.findOneAndUpdate).toBeCalledWith(
          { _id: oderId },
          { states: 'cancelled' },
          { new: true },
        );
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('checkStatus', () => {
    const oderId = '624b9dba8d375f5afe5e2ce3';

    it('checkStatus successfully', async () => {
      OderModelMock.findOne.mockImplementation((query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          states: 'confirmed',
        };
      });

      const rs = await oderRepository.checkStatus(oderId);

      expect(OderModelMock.findOne).toBeCalledWith(
        { _id: oderId },
        { states: true },
      );
      expect(rs.states).toEqual('confirmed');
    });

    it('cancelOder should throw error', async () => {
      OderModelMock.findOne.mockImplementation((query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderRepository.checkStatus(oderId);
      } catch (error) {
        expect(OderModelMock.findOne).toBeCalledWith(
          { _id: oderId },
          { states: true },
        );
        expect(error.message).toEqual('Internal server error');
      }
    });
  });
});
