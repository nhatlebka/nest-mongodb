import { Injectable } from '@nestjs/common';
import { Oder } from './oders.schema';
import { FilterQuery } from 'mongoose';
import { OderCreateDto, OderDto, OderStatus } from './oders.dto';
import { OderRepository } from './oders.repository';

@Injectable()
export class OdersService {
  constructor(private readonly oderRepository: OderRepository) {}

  async getOders(query: FilterQuery<Oder>): Promise<Oder[]> {
    return this.oderRepository.find(query);
  }

  async create(data: OderDto): Promise<OderCreateDto> {
    return this.oderRepository.create(data);
  }

  async update(query: FilterQuery<Oder>, data: Object): Promise<Oder> {
    return this.oderRepository.update(query, data);
  }

  async cancelOder(oderId: string): Promise<Oder> {
    return this.oderRepository.cancelOder(oderId);
  }

  async checkStatus(oderId: string): Promise<OderStatus> {
    return this.oderRepository.checkStatus(oderId);
  }
}
