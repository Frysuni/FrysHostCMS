import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { TokensService } from './tokens.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { EmailService } from '../email/email.service';
import { ResetDto } from './dto/reset.dto';
import { AvailableQueryDto } from './dto/available.dto';
import { RegisterDto } from './dto/register.dto';
import { DiscordService } from '../discord/discord.service';
import { FastifyReply } from 'fastify';
import { ApiException } from '@system/apiException';
import * as authenticator from 'authenticator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TotpEntity } from './entities/totp.entity';
import { SetTotpDto } from './dto/setTotp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly emailService: EmailService,
    private readonly discordService: DiscordService,
    @InjectRepository(TotpEntity) private totpRepository: Repository<TotpEntity>
  ) {}

  async available(availableQueryDto: AvailableQueryDto) {
    if (!availableQueryDto.email && !availableQueryDto.username) throw new ApiException('BAD_REQUEST', 'AuthAvailable: Username or email is not specified');
    return { available: await this.usersService.available(availableQueryDto) };
  }

  async register(registerDto: RegisterDto, res: FastifyReply) {
    if (!await this.emailService.validateActivateEmail(registerDto.email, registerDto.code)) {
      throw new ApiException('BAD_REQUEST', 'AuthRegister: Invalid email activation code. (Or email not the same)');
    }
    const memberId = await this.discordService.validateAuthCode(registerDto.token);
    if (!memberId) {
      throw new ApiException('BAD_REQUEST', 'AuthRegister: Invalid discord authorization token');
    }
    await this.usersService.create({ ...registerDto, memberId });

    return this.login({ usernameOrEmail: registerDto.username, password: registerDto.password }, res);
  }

  async login(loginDto: LoginDto, res: FastifyReply) {
    const user = await this.usersService.getUser({ username: loginDto.usernameOrEmail, email: loginDto.usernameOrEmail }, true);

    if (!user || !compareSync(loginDto.password, user.password)) throw new ApiException('BAD_REQUEST', 'AuthLogin: Invalid usernameOrEmail or password');

    const tokens = await this.tokensService.getTokensPair(user.uuid);
    res.setCookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000 });

    return {
      accessToken: tokens.accessToken,
      expiresAfter: tokens.expiresAfter,
    };
  }

  async refresh(res: FastifyReply, refreshToken: string): Promise<{ accessToken: string, expiresAfter: number }> {
    const userUUID = await this.tokensService.validateRefreshToken(refreshToken);

    if (!userUUID) throw new ApiException('BAD_REQUEST', 'AuthRefresh: Invalid refresh token');

    const tokens = await this.tokensService.getTokensPair(userUUID);
    res.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: true });
    return {
      accessToken: tokens.accessToken,
      expiresAfter: tokens.expiresAfter,
    };
  }

  async createTotp(uuid: string) {

    const key = authenticator.generateKey();
    const username = (await this.usersService.getUser({ uuid }))?.username as string;
    await this.totpRepository.save({ key, uuid });

    return { key, totp: authenticator.generateTotpUri(key, username, 'FrysHost', 'SHA512', 6, 60) };
  }

  async setTotp(uuid: string, setTotpDto: SetTotpDto) {
    const record = await this.totpRepository.findOne({ where: { key: setTotpDto.key, uuid } });
    if (!record) throw new ApiException('BAD_REQUEST', 'AuthSetTotp: Invalid 2fa key');

    const result = authenticator.verifyToken(setTotpDto.key, setTotpDto.code);
    if (!result || result?.delta <= -2) throw new ApiException('BAD_REQUEST', 'AuthSetTotp: Invalid 2fa code');

    await this.usersService.setTotp(uuid, setTotpDto.key);

    await this.totpRepository.delete(record);
  }

  // async changePassword(uuid: string, changePasswordDto: ChangePasswordDto) {
  //   const user = await this.usersService.getUser({ uuid }, true);

  //   if (!user || !compareSync(changePasswordDto.old_password, user.password)) {
  //     throw new UnauthorizedException();
  //   }

  //   this.emailService.changePasswordRequest({ uuid, email: user.email, new_password: changePasswordDto.new_password, redirectUrl: changePasswordDto.redirectUrl });
  // }

  // async resetPassword(resetDto: ResetDto) {
  //   if (!await this.usersService.userExists({ email: resetDto.email })) return;
  //   this.emailService.resetPasswordRequest(resetDto);
  // }
}
