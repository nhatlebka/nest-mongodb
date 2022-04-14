import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto, UserQuery } from './users.dto';
import { Request } from 'express';
import { ValidationPipe } from '@pipes/validation.pipe';
import { JwtAuthGuard } from '@guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(
    @Query() query: UserQuery,
    @Req() req: Request,
  ): Promise<User[]> {
    return this.usersService.getUsers(query);
  }
}
