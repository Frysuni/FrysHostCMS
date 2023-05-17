import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import envConfig from '@env';
import { TokensService } from './tokens.service';
import { SessionsEntity } from './entities/sessions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleRecaptchaModule, GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha';
import { DiscordModule } from '../discord/discord.module';
import secrets from '@system/secrets';
import { TotpEntity } from './entities/totp.entity';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    HttpModule,
    DiscordModule,
    JwtModule.register({
      secret: secrets.jwtSecretKey,
      signOptions: { expiresIn: '5m' },
    }),
    TypeOrmModule.forFeature([SessionsEntity, TotpEntity]),
    GoogleRecaptchaModule.forRoot({
      secretKey: envConfig.recaptchaSecret,
      response: req => req.headers.recaptcha,
      skipIf: envConfig.debug,
      network: GoogleRecaptchaNetwork.Recaptcha,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
