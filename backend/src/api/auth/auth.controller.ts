import { Controller, Post, Body, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { UserUUID } from './auth.guard';
import { ResetDto } from './dto/reset.dto';
import { AvailableQueryDto } from './dto/available.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { FastifyReply } from 'fastify';
import { R } from '@system/response.decorator';
import { Cookies } from '@system/cookies.decorator';
import * as authenticator from 'authenticator';
import { SetTotpDto } from './dto/setTotp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('available')
  available(@Query() availableQueryDto: AvailableQueryDto) {
    return this.authService.available(availableQueryDto);
  }

  @Post('register')
  @Recaptcha()
  register(@Body() registerDto: RegisterDto, @R res: FastifyReply) {
    return this.authService.register(registerDto, res);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @R res: FastifyReply) {
    return this.authService.login(loginDto, res);
  }

  @Post('refresh')
  refresh(@R res: FastifyReply, @Cookies('refreshToken') refreshToken: string) {
    return this.authService.refresh(res, refreshToken);
  }

  @Get('2fa')
  @AuthGuard()
  createTotp(@UserUUID() uuid: string) {
    return this.authService.createTotp(uuid);
  }

  @Post('2fa')
  @AuthGuard()
  setTotp(@UserUUID() uuid: string, @Body() setTotpDto: SetTotpDto) {
    return this.authService.setTotp(uuid, setTotpDto);
  }
  // @AuthGuard()
  // @Post('change/password')
  // changePass(@UserUUID() uuid: string, @Body() changePasswordDto: ChangePasswordDto) {
  //   return this.authService.changePassword(uuid, changePasswordDto);
  // }

  // @Post('reset')
  // resetPassword(@Body() resetDto: ResetDto) {
  //   this.authService.resetPassword(resetDto);
  // }
}
