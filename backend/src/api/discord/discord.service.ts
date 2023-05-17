import envConfig from '@env';
import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { RawAxiosRequestHeaders } from 'axios';
import CallbackQueryDto from './dto/CallbackQuery.dto';
import { firstValueFrom } from 'rxjs';
import { URL, URLSearchParams } from 'node:url';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscordConfirmationEntity } from './entities/discordConfirmation.entity';
import {
  Routes,
  OAuth2Scopes,
  OAuth2Routes,
  RESTOAuth2AuthorizationQuery,
  RESTPostOAuth2AccessTokenURLEncodedData,
  RESTPostOAuth2AccessTokenResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildMemberResult,
  RESTPostOAuth2RefreshTokenURLEncodedData,
  RESTPostOAuth2RefreshTokenResult,
} from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import { resolve } from 'node:path';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { ApiException } from '@system/apiException';
import { UsersService } from 'api/users/users.service';

@Injectable()
export class DiscordService {
  private readonly rest = new REST({ authPrefix: 'Bearer', version: '10', retries: 2, timeout: 5_000 });
  constructor(
    @InjectRepository(DiscordConfirmationEntity)
    private readonly discordConfirmationRepository: Repository<DiscordConfirmationEntity>,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  async auth(): Promise<string> {
    const redirectUrl = new URL(envConfig.apiUrl + 'discord/auth/callback');

    const query: RESTOAuth2AuthorizationQuery = {
      client_id: envConfig.discord.clientId,
      response_type: 'code',
      scope: [OAuth2Scopes.Identify, OAuth2Scopes.Guilds, OAuth2Scopes.GuildsMembersRead].join(' '),
      prompt: 'none',
      state: await this.generateStateToken(),
      redirect_uri: redirectUrl.href,
    };

    const authorizeUrl = new URL(OAuth2Routes.authorizationURL);
    authorizeUrl.search = new URLSearchParams({ ...query }).toString();
    return authorizeUrl.href;
  }

  async authCallbackHandler(callbackQuery: CallbackQueryDto, ip: string): Promise<string> {
    const exist = await this.discordConfirmationRepository.exist({ where: { type: 'state', token: callbackQuery.state } });
    if (!exist) throw new ApiException('BAD_REQUEST', 'DiscordAuthCallbackHandler: Invalid state token');
    this.discordConfirmationRepository.delete({ type: 'state', token: callbackQuery.state });

    const authData = await this.getAuthData(callbackQuery.code);

    const user = await this.getDiscordUser(authData.access_token);

    this.writeMemberData(callbackQuery, user.user, user.userGuilds, user.member, ip, authData);

    const authToken = await this.generateAuthToken(user.user.id);
    const redirectUrl = envConfig.baseUrl;
    redirectUrl.pathname = 'register';
    if (user.memberExists) {
      redirectUrl.searchParams.append('auth', authToken);
    } else {
      redirectUrl.searchParams.append('auth', 'false');
    }

    return redirectUrl.href;
  }

  private async getDiscordUser(access_token: string, preferValidMember?: undefined): Promise<{
    user: RESTGetAPICurrentUserResult;
    userGuilds: RESTGetAPICurrentUserGuildsResult;
    member?: RESTGetAPIGuildMemberResult | false;
    memberExists: boolean;
  }>
  private async getDiscordUser(access_token: string, preferValidMember: true): Promise<{
    user: RESTGetAPICurrentUserResult;
    userGuilds: RESTGetAPICurrentUserGuildsResult;
    member: RESTGetAPIGuildMemberResult;
    memberExists: boolean;
  }>
  private async getDiscordUser(access_token: string) {
    const rest = this.rest.setToken(access_token);

    const user = await rest.get(Routes.user()) as RESTGetAPICurrentUserResult;
    const userGuilds = await rest.get(Routes.userGuilds()) as RESTGetAPICurrentUserGuildsResult;
    const member = await rest.get(Routes.userGuildMember(envConfig.discord.guildId)).catch(() => false) as RESTGetAPIGuildMemberResult | false;

    const memberExists = userGuilds.find(guild => guild.id === envConfig.discord.guildId) ? true : false;

    return { user, userGuilds, member: member ?? false, memberExists };
  }

  async validateAuthCode(authCode: string): Promise<string | false> {
    const entity = await this.discordConfirmationRepository.findOne({ where: { type: 'auth', token: authCode } });
    if (!entity) return false;
    await this.discordConfirmationRepository.remove(entity);
    return entity.memberId;
  }

  private async getAuthData(authorizationCode: string): Promise<RESTPostOAuth2AccessTokenResult> {
    const data: RESTPostOAuth2AccessTokenURLEncodedData = {
      client_id: envConfig.discord.clientId,
      client_secret: envConfig.discord.clientSecret,
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: envConfig.apiUrl + 'discord/auth/callback',
    };

    const headers: RawAxiosRequestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip,deflate,compress' };

    const request = this.httpService.post<RESTPostOAuth2AccessTokenResult>(OAuth2Routes.tokenURL, data, { headers });

    return (await firstValueFrom(request)).data;
  }

  private async refresh(refresh_token: string): Promise<RESTPostOAuth2RefreshTokenResult> {
    const data: RESTPostOAuth2RefreshTokenURLEncodedData = {
      client_id: envConfig.discord.clientId,
      client_secret: envConfig.discord.clientSecret,
      grant_type: 'refresh_token',
      refresh_token,
    };

    const headers: RawAxiosRequestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept-Encoding': 'gzip,deflate,compress' };

    const request = this.httpService.post<RESTPostOAuth2RefreshTokenResult>(OAuth2Routes.tokenURL, data, { headers });

    return (await firstValueFrom(request)).data;
  }

  private async generateStateToken() {
    const stateToken = this.generateToken();
    const entity = this.discordConfirmationRepository.create({ type: 'state', token: stateToken });
    await this.discordConfirmationRepository.save(entity);
    return stateToken;
  }

  private async generateAuthToken(memberId: string): Promise<string | 'exists'> {
    if (await this.usersService.getUser({ memberId })) return 'exists';
    const authToken = this.generateToken();
    const entity = this.discordConfirmationRepository.create({ type: 'auth', token: authToken, memberId });
    await this.discordConfirmationRepository.save(entity);
    return authToken;
  }

  private generateToken() {
    const charCodes = [];
    const randomLength = 32 + ~~(Math.random() * 16 + 1);
    for (let i = 0; i < randomLength; i++) {
        let rand = Math.floor(Math.random() * 62);
        const charCode = rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48;
        charCodes.push(charCode);
    }
    return String.fromCharCode(...charCodes);
  }

  private async writeMemberData(
    callbackQuery: CallbackQueryDto,
    user: RESTGetAPICurrentUserResult,
    userGuilds: RESTGetAPICurrentUserGuildsResult,
    member: RESTGetAPIGuildMemberResult | false,
    ip: string,
    authData: RESTPostOAuth2AccessTokenResult
  ) {
    const path = resolve(__dirname, '../', '../', 'DiscordUsers');
    if (!existsSync(path)) mkdirSync(path);

    const file = resolve(path, `${user.username}.json`);
    if (existsSync(file)) rmSync(file);

    const object = { time: new Date().toISOString(), ip, authData, callbackQuery, user, userGuilds, member };
    writeFileSync(file, JSON.stringify(object, undefined, 2));
  }
}
