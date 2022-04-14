import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true, length: [3, 20], unique: true })
  username: string;

  @Prop({ type: String, required: true, length: [6, 20] })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: Number, required: true })
  customerId: number;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre<User>('save', function (this: User) {
//   this.updatedAt = new Date();
// });

export { UserSchema };
