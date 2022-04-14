import { Document, Model, FilterQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected abstract entityDocument: T & Document;

  constructor(protected readonly entityModel: Model<T>) {}

  async find(query: FilterQuery<T>) {
    return this.entityModel.find(query).lean().exec();
  }

  async findOne(query: FilterQuery<T>) {
    return this.entityModel.findOne(query).exec();
  }

  async create(data: Object) {
    return this.entityModel.create(data);
  }

  async update(query: FilterQuery<T>, data: Object) {
    return this.entityModel.findOneAndUpdate(query, data, { new: true });
  }

  async delete(query: FilterQuery<T>) {
    return this.entityModel.deleteOne(query);
  }
}
