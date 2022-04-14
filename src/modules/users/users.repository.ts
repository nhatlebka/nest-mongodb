import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './users.schema';
import { BaseRepository } from '@common/base-repository';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  protected entityDocument: UserDocument;

  constructor(
    @InjectModel('USERS')
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
