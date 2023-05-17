import { Body, Controller, Get, Put } from '@nestjs/common';
import { AuthGuard, UserUUID } from '../auth/auth.guard';
import { AssetsService } from './assets.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly assetsService: AssetsService,
  ) {}

  @Get('me')
  @AuthGuard()
  me(@UserUUID() uuid: string) {
    return this.usersService.getUser({ uuid });
  }

  @Put('assets/skin')
  // @AuthGuard()
  setSkin(@UserUUID() uuid: string, @Body('data') data: string) {
    return this.assetsService.setSkin('7122b822-f2a2-4317-84c4-0ac7c4485508', true, data);
  }
}
