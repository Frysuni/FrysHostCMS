import { Body, Controller, Post } from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Post('activate')
  // @Recaptcha()
  activateEmail(@Body('email') email: string) {
    return this.emailService.activateEmail(email);
  }

}
