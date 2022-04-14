import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OderRepository } from './oders.repository';
import { OdersService } from './oders.service';

const OderRepositoryMock = {
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  cancelOder: jest.fn(),
  checkStatus: jest.fn(),
};

describe('OdersService', () => {
  let oderService: OdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdersService, OderRepository],
    })
      .overrideProvider(OderRepository)
      .useValue(OderRepositoryMock)
      .compile();

    oderService = module.get<OdersService>(OdersService);
  });

  describe('getOders', () => {
    const query = { customerId: 1002 };
    it('getOders should return list Oders', async () => {
      OderRepositoryMock.find.mockImplementation(async (query) => {
        return [
          {
            _id: '624b9dba8d375f5afe5e2ce3',
            customerId: 1002,
            states: 'created',
            totalAmount: 420000,
          },
        ];
      });

      const rs = await oderService.getOders(query);

      expect(OderRepositoryMock.find).toBeCalledWith(query);
      expect(rs[0].customerId).toBe(1002);
    });

    it('getOders should throw error', async () => {
      OderRepositoryMock.find.mockImplementation(async (query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderService.getOders(query);
      } catch (error) {
        expect(OderRepositoryMock.find).toBeCalledWith(query);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('create', () => {
    const data = {
      customerId: 1002,
      totalAmount: 420000,
      comment: null,
    };
    it('create should return new Oder', async () => {
      OderRepositoryMock.create.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'created',
          totalAmount: 420000,
          comment: null,
        };
      });

      const rs = await oderService.create(data);

      expect(OderRepositoryMock.create).toBeCalledWith(data);
      expect(rs.customerId).toBe(1002);
      expect(rs.states).toBe('created');
    });

    it('getOders should throw error', async () => {
      OderRepositoryMock.create.mockImplementation(async (query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderService.create(data);
      } catch (error) {
        expect(OderRepositoryMock.create).toBeCalledWith(data);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('update', () => {
    const query = {
      customerId: 1002,
    };

    const update = { states: 'confirmed' };
    it('update should return Oder', async () => {
      OderRepositoryMock.update.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'confirmed',
          totalAmount: 420000,
        };
      });

      const rs = await oderService.update(query, update);

      expect(OderRepositoryMock.update).toBeCalledWith(query, update);
      expect(rs.customerId).toBe(1002);
      expect(rs.states).toBe('confirmed');
    });

    it('getOders should throw error', async () => {
      OderRepositoryMock.update.mockImplementation(async (query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderService.update(query, update);
      } catch (error) {
        expect(OderRepositoryMock.update).toBeCalledWith(query, update);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('cancelOder', () => {
    const oderId = '624b9dba8d375f5afe5e2ce3';

    it("cancelOder should return Oder with states: 'canceled'", async () => {
      OderRepositoryMock.cancelOder.mockImplementation(async (oderId) => {
        return {
          customerId: 1002,
          states: 'canceled',
        };
      });

      const rs = await oderService.cancelOder(oderId);

      expect(OderRepositoryMock.cancelOder).toBeCalledWith(oderId);
      expect(rs.customerId).toBe(1002);
      expect(rs.states).toBe('canceled');
    });

    it('cancelOder should throw error', async () => {
      OderRepositoryMock.cancelOder.mockImplementation(async (oderId) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderService.cancelOder(oderId);
      } catch (error) {
        expect(OderRepositoryMock.cancelOder).toBeCalledWith(oderId);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('checkStatus', () => {
    const oderId = '624b9dba8d375f5afe5e2ce3';

    it('checkStatus should return Oder states', async () => {
      OderRepositoryMock.checkStatus.mockImplementation(async (oderId) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          states: 'delivered',
        };
      });

      const rs = await oderService.checkStatus(oderId);

      expect(OderRepositoryMock.checkStatus).toBeCalledWith(oderId);
      expect(rs._id).toBe('624b9dba8d375f5afe5e2ce3');
      expect(rs.states).toBe('delivered');
    });

    it('checkStatus should throw error', async () => {
      OderRepositoryMock.checkStatus.mockImplementation(async (oderId) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderService.checkStatus(oderId);
      } catch (error) {
        expect(OderRepositoryMock.checkStatus).toBeCalledWith(oderId);
        expect(error.message).toBe('Internal server error');
      }
    });
  });
});
