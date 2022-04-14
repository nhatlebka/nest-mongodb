import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './users.repository';
import { User } from './users.schema';
import { FilterQuery } from 'mongoose';
import { UserDto, UserEntity } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: UserDto) {
    const password = bcrypt.hash(data.password, 10);
    const newData = { ...data, password };
    return this.userRepository.create(newData);
  }

  async getUsers(query: FilterQuery<User>): Promise<User[]> {
    const users = await this.userRepository.find(query);

    return users.map((user) => new UserEntity(user));
  }

  async getUser(username: string) {
    return this.userRepository.findOne({ username });
  }
}
