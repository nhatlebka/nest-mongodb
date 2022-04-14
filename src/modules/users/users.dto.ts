import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { MongoId } from 'src/common/mongo.type';

export class UserEntity {
  @Exclude()
  _id: MongoId;
  username: string;

  @Exclude()
  password: string;

  email: string;

  customerId: number;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class UserQuery {
  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  customerId?: number;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}

export class UserDto {
  @ApiProperty({ example: 'user1' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @ApiProperty({ example: 'password1' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @ApiProperty({ example: 'email@123.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 1002 })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}

export class UserDecorator {
  username: string;
  customerId: number;
}
