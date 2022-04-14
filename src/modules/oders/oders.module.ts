import { JwtStrategy } from '@guards/strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from '@utils/token/token.module';

import { OdersController } from './oders.controller';
import { OderRepository } from './oders.repository';
import { OderSchema } from './oders.schema';

import { OdersService } from './oders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ODERS',
        schema: OderSchema,
      },
    ]),
    TokenModule,
  ],
  controllers: [OdersController],
  providers: [OdersService, OderRepository, JwtStrategy],
})
export class OdersModule {}
