import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://lenn:1234@cluster0.dbox4.mongodb.net/mcr_nestjs?retryWrites=true&w=majority',
    ),
  ],
})
export class MongoModule {}
