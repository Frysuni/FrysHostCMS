import { Controller, Get, Ip, Query } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { HttpStatusCode } from 'axios';
import { Redirect } from 'nestjs-fastify-redirect';
import { DiscordService } from './discord.service';
import CallbackQueryDto from './dto/CallbackQuery.dto';

@Controller('discord')
export class DiscordController {
  constructor(
    private readonly discordService: DiscordService,
  ) {}

  @Get('auth')
  @Recaptcha()
  async auth(): Promise<{ url: string; }> {
    return { url: await this.discordService.auth() };
  }

  @Get('auth/callback')
  @Redirect()
  async authCallbackHandler(@Query() callbackQuery: CallbackQueryDto, @Ip() ip: string) {
    return { url: await this.discordService.authCallbackHandler(callbackQuery, ip), statusCode: HttpStatusCode.TemporaryRedirect };
  }
}
