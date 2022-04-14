import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class OderDto {
  @ApiProperty()
  createdAt?: Date;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  comment: string | null;
  @ApiProperty({ example: 580000 })
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;
}

export class OderQuery {
  @ApiProperty({ required: false })
  createdAt?: Date;
  @ApiProperty({ type: 'string', required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  comment?: string | null;

  @ApiProperty({
    enum: ['created', 'confirmed', 'delivered', 'cancelled'],
    required: false,
  })
  states?: string;

  @ApiProperty({ required: false })
  totalAmount?: number;
}

export class OderStatus {
  @ApiProperty({ example: '624b9da18d375f5afe5e2ce1' })
  _id: string;
  @ApiProperty({ example: 'cancelled' })
  states: string;
}

export class OderCreateDto {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  comment: string;
  totalAmount: number;
  customerId: number;
  states: string;
}
