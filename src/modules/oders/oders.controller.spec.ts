import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OdersController } from './oders.controller';
import { OderQuery } from './oders.dto';
import { OdersService } from './oders.service';
import axios from 'axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

const OdersServiceMock = {
  getOders: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  cancelOder: jest.fn(),
  checkStatus: jest.fn(),
};

const ConfigServiceMock = {
  get: jest.fn(),
};

describe('OdersController', () => {
  let oderController: OdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdersController],
      providers: [OdersService, ConfigService],
    })
      .overrideProvider(OdersService)
      .useValue(OdersServiceMock)
      .overrideProvider(ConfigService)
      .useValue(ConfigServiceMock)
      .compile();

    oderController = module.get<OdersController>(OdersController);

    jest.clearAllMocks();
  });

  describe('getOders', () => {
    const query: OderQuery = {};
    const user = {
      username: 'user1',
      customerId: 1002,
    };
    it('getOders should return oderList', async () => {
      OdersServiceMock.getOders.mockImplementation(async (query) => {
        return [
          {
            _id: '624b9dba8d375f5afe5e2ce3',
            customerId: 1002,
            states: 'created',
            totalAmount: 420000,
          },
        ];
      });

      const oderList = await oderController.getOders(query, user);

      expect(OdersServiceMock.getOders).toBeCalledWith({
        ...query,
        customerId: user.customerId,
      });
      expect(oderList).toEqual([
        {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          states: 'created',
          totalAmount: 420000,
        },
      ]);
    });

    it("getOders should throw error 'Can not get oders'", async () => {
      OdersServiceMock.getOders.mockImplementation(async (query) => {
        return [];
      });

      try {
        await oderController.getOders(query, user);
      } catch (error) {
        expect(OdersServiceMock.getOders).toBeCalledWith({
          ...query,
          customerId: user.customerId,
        });
        expect(error.message).toEqual('Cannot get Oders');
        expect(error.status).toEqual(400);
      }
    });

    it("getOders should throw error 'Internal server error'", async () => {
      OdersServiceMock.getOders.mockImplementation(async (query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderController.getOders(query, user);
      } catch (error) {
        expect(OdersServiceMock.getOders).toBeCalledWith({
          ...query,
          customerId: user.customerId,
        });
        expect(error.message).toEqual('Internal server error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('createrOder', () => {
    const body = {
      comment: null,
      totalAmount: 580000,
    };
    const user = {
      username: 'user1',
      customerId: 1002,
    };
    const req = {
      headers: {
        authorization: 'Bearer Avkvkvkkvkvkkv',
      },
    } as Request;

    jest.useFakeTimers();

    it("createrOder should return new oder with states : 'confirmed'", async () => {
      ConfigServiceMock.get.mockImplementation((query) => {
        return 0;
      });
      OdersServiceMock.create.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'created',
          totalAmount: 420000,
        };
      });

      jest.spyOn(axios, 'post').mockImplementation(async () => {
        return {
          data: {
            status: 'confirmed',
          },
        };
      });

      OdersServiceMock.update.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'confirmed',
          totalAmount: 420000,
        };
      });
      OdersServiceMock.checkStatus.mockImplementation(async (query) => {
        return {
          states: 'confirmed',
        };
      });

      const rs = await oderController.createOder(body, user, req);
      jest.runAllTimers();
      expect(OdersServiceMock.create).toBeCalledWith({
        ...body,
        customerId: user.customerId,
      });
      expect(axios.post).toBeCalled();
      expect(OdersServiceMock.update).toBeCalledWith(
        { _id: '624b9dba8d375f5afe5e2ce3' },
        { states: 'confirmed' },
      );
      expect(OdersServiceMock.checkStatus).toBeCalledWith(
        '624b9dba8d375f5afe5e2ce3',
      );
      expect(rs.customerId).toEqual(1002);
      expect(rs.states).toEqual('confirmed');
    });

    it("createrOder should return new oder with states : 'confirmed' and not update states", async () => {
      ConfigServiceMock.get.mockImplementation((query) => {
        return 0;
      });
      OdersServiceMock.create.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'created',
          totalAmount: 420000,
        };
      });

      jest.spyOn(axios, 'post').mockImplementation(async () => {
        return {
          data: {
            status: 'confirmed',
          },
        };
      });

      OdersServiceMock.update.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'confirmed',
          totalAmount: 420000,
        };
      });
      OdersServiceMock.checkStatus.mockImplementation(async (query) => {
        return {
          states: 'cancelled',
        };
      });

      const rs = await oderController.createOder(body, user, req);
      jest.runAllTimers();
      expect(OdersServiceMock.create).toBeCalledWith({
        ...body,
        customerId: user.customerId,
      });
      expect(axios.post).toBeCalled();
      expect(OdersServiceMock.update).toBeCalledWith(
        { _id: '624b9dba8d375f5afe5e2ce3' },
        { states: 'confirmed' },
      );
      expect(OdersServiceMock.checkStatus).toBeCalledWith(
        '624b9dba8d375f5afe5e2ce3',
      );
      expect(rs.customerId).toEqual(1002);
      expect(rs.states).toEqual('confirmed');
    });

    it("createrOder should return new oder with states : 'cancelled'", async () => {
      OdersServiceMock.create.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'created',
          totalAmount: 420000,
        };
      });

      jest.spyOn(axios, 'post').mockImplementation(async () => {
        return {
          data: {
            status: 'declined',
          },
        };
      });

      OdersServiceMock.cancelOder.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'cancelled',
          totalAmount: 420000,
        };
      });

      const rs = await oderController.createOder(body, user, req);

      expect(OdersServiceMock.create).toBeCalledWith({
        ...body,
        customerId: user.customerId,
      });
      expect(axios.post).toBeCalled();
      expect(OdersServiceMock.cancelOder).toBeCalledWith(
        '624b9dba8d375f5afe5e2ce3',
      );

      expect(rs.customerId).toEqual(1002);
      expect(rs.states).toEqual('cancelled');
    });

    it('createrOder should throw error when axios have error', async () => {
      OdersServiceMock.create.mockImplementation(async (query) => {
        return {
          _id: '624b9dba8d375f5afe5e2ce3',
          customerId: 1002,
          comment: null,
          states: 'created',
          totalAmount: 420000,
        };
      });

      jest.spyOn(axios, 'post').mockImplementation(async () => {
        throw new HttpException('Bad request', 400);
      });

      try {
        await oderController.createOder(body, user, req);
      } catch (error) {
        expect(OdersServiceMock.create).toBeCalledWith({
          ...body,
          customerId: user.customerId,
        });

        expect(error.status).toEqual(400);
        expect(error.message).toEqual('Bad request');
      }
    });

    it('createrOder should throw error when server error', async () => {
      OdersServiceMock.create.mockImplementation(async (query) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderController.createOder(body, user, req);
      } catch (error) {
        expect(OdersServiceMock.create).toBeCalledWith({
          ...body,
          customerId: user.customerId,
        });

        expect(error.status).toEqual(500);
        expect(error.message).toEqual('Internal server error');
      }
    });
  });

  describe('checkStatus', () => {
    const param = 'sadkjasjv';
    it('checkStatus should return status oder', async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        return {
          _id: param,
          states: 'created',
        };
      });

      const rs = await oderController.checkStatus(param);

      expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
      expect(rs._id).toBe(param);
      expect(rs.states).toBe('created');
    });

    it('checkStatus should throw error when id has not exist', async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderController.checkStatus(param);
      } catch (error) {
        expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('cancelOder', () => {
    const param = 'sadkjasjv';
    it('cancelOder should update status successfully', async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        return {
          _id: param,
          states: 'created',
        };
      });

      OdersServiceMock.cancelOder.mockImplementation(async (id) => {
        return {
          states: 'cancelled',
        };
      });
      const rs = await oderController.cancelOder(param);

      expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
      expect(OdersServiceMock.cancelOder).toBeCalledWith(param);
      expect(rs.states).toBe('cancelled');
    });

    it("cancelOder should throw error when status = 'cancelled'", async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        return {
          _id: param,
          states: 'cancelled',
        };
      });

      try {
        await oderController.cancelOder(param);
      } catch (error) {
        expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
        expect(error.status).toBe(400);
        expect(error.message).toBe('oder has been canceled before');
      }
    });

    it("cancelOder should throw error when status = 'delivered'", async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        return {
          _id: param,
          states: 'delivered',
        };
      });

      try {
        await oderController.cancelOder(param);
      } catch (error) {
        expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
        expect(error.status).toBe(400);
        expect(error.message).toBe('oder has been delivered');
      }
    });

    it('cancelOder should throw error when id has not exist', async () => {
      OdersServiceMock.checkStatus.mockImplementation(async (id) => {
        throw new HttpException('Internal server error', 500);
      });

      try {
        await oderController.cancelOder(param);
      } catch (error) {
        expect(OdersServiceMock.checkStatus).toBeCalledWith(param);
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal server error');
      }
    });
  });
});
