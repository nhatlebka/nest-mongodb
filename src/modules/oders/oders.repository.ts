import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { OderDocument } from './oders.schema';
import { OderStatus } from './oders.dto';
import { BaseRepository } from '@common/base-repository';

@Injectable()
export class OderRepository extends BaseRepository<OderDocument> {
  protected entityDocument: OderDocument;

  constructor(
    @InjectModel('ODERS')
    private readonly oderModel: Model<OderDocument>,
  ) {
    super(oderModel);
  }

  async cancelOder(oderId: string) {
    return this.oderModel.findOneAndUpdate(
      { _id: oderId },
      { states: 'cancelled' },
      { new: true },
    );
  }

  async checkStatus(oderId: string): Promise<OderStatus> {
    return this.oderModel.findOne({ _id: oderId }, { states: true });
  }
}
