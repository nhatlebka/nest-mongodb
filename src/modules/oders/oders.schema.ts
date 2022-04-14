import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OderDocument = Oder & Document;

@Schema()
export class Oder {
  @Prop({ type: Number, required: true })
  @ApiProperty({ example: 1002 })
  customerId: number;

  @ApiProperty()
  @Prop({ type: Date, required: true, default: Date.now })
  createdAt?: Date;

  @ApiProperty()
  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt?: Date;

  @ApiProperty({ example: null })
  @Prop({ type: [String, null], default: null })
  comment: string | null;

  @ApiProperty({ example: 'created' })
  @Prop({
    required: true,
    type: String,
    enum: ['created', 'confirmed', 'delivered', 'cancelled'],
    default: 'created',
  })
  states: string;

  @ApiProperty({ example: 580000 })
  @Prop({ type: Number, required: true })
  totalAmount: number;
}

const OderSchema = SchemaFactory.createForClass(Oder);

// OderSchema.pre<Oder>('save', function (this: Oder) {
//   this.updatedAt = new Date();
// });

export { OderSchema };
