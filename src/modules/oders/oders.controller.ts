import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OdersService } from './oders.service';
import { Oder } from './oders.schema';
import { OderDto, OderQuery, OderStatus } from './oders.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@guards/jwt.guard';
import { Customer } from '@utils/user.decorator';
import { UserDecorator } from '@users/users.dto';

@ApiTags('Oders')
@Controller('oders')
export class OdersController {
  constructor(
    private readonly odersService: OdersService,
    private config: ConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [Oder] })
  async getOders(
    @Query() query: OderQuery,
    @Customer() user: UserDecorator,
  ): Promise<Oder[]> {
    const oderList = await this.odersService.getOders({
      ...query,
      customerId: user.customerId,
    });
    if (oderList.length > 0) {
      return oderList;
    }

    throw new HttpException('Cannot get Oders', 400);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Oder })
  async createOder(
    @Body() data: OderDto,
    @Customer() user: UserDecorator,
    @Req() req: Request,
  ) {
    const newData = { ...data, customerId: user.customerId };

    const oder = await this.odersService.create(newData);
    oder.customerId = 1111;
    const config = {
      headers: {
        Authorization: req.headers.authorization,
      },
    };

    try {
      const paymentUrl = this.config.get('PAYMENT_URL');
      const rs = await axios.post(paymentUrl, oder, config);

      if (rs.data.status === 'declined') {
        const cancelOder = await this.odersService.cancelOder(oder._id);

        return cancelOder;
      } else {
        const updateOder = await this.odersService.update(
          { _id: oder._id },
          { states: 'confirmed' },
        );

        const time = parseInt(this.config.get('TIMEOUT'));

        setTimeout(async () => {
          const status = await this.odersService.checkStatus(oder._id);

          if (status.states === 'confirmed') {
            await this.odersService.update(
              { _id: oder._id },
              { states: 'delivered' },
            );
          }

          return true;
        }, time);

        return updateOder;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/checkStatus/:oderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OderStatus })
  async checkStatus(@Param('oderId') oderId: string) {
    return await this.odersService.checkStatus(oderId);
  }

  @Get('cancel/:oderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cancelOder(@Param('oderId') oderId: string) {
    const status = await this.odersService.checkStatus(oderId);
    if (status.states === 'cancelled') {
      throw new HttpException('oder has been canceled before', 400);
    } else if (status.states === 'delivered') {
      throw new HttpException('oder has been delivered', 400);
    } else {
      return await this.odersService.cancelOder(oderId);
    }
  }
}
