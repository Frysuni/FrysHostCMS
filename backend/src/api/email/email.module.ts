import envConfig from '@env';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule, GoogleRecaptchaNetwork } from '@nestlab/google-recaptcha';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ActivateEmailEntity } from './entities/activateEmail.entity';

@Module({
  imports: [
    GoogleRecaptchaModule.forRoot({
      secretKey: envConfig.recaptchaSecret,
      response: req => req.headers.recaptcha,
      skipIf: envConfig.debug,
      network: GoogleRecaptchaNetwork.Recaptcha,
    }),
    MailerModule.forRoot({
      defaults: {
        from: `${envConfig.name} <${envConfig.mailer.auth.user}>`,
      },
      transport: envConfig.mailer,
    }),
    TypeOrmModule.forFeature([ActivateEmailEntity]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
