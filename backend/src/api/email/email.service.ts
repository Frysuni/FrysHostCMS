import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivateEmailEntity } from './entities/activateEmail.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(ActivateEmailEntity)
    private readonly activateEmailRepository: Repository<ActivateEmailEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async activateEmail(email: string) {
    let code = '';
    const existRecord = await this.activateEmailRepository.findOne({ where: { email } });
    if (existRecord) {
      code = existRecord.code;
    } else {
      const numbers: number[] = [];
      for (let i = 0; i < 6; i++) numbers.push(Math.floor(Math.random() * 9 + 1));
      for (let i = 0; i < 6; i++) code += numbers[Math.floor(Math.random() * 6)];

      const record = this.activateEmailRepository.create({ code, email });
      await this.activateEmailRepository.save(record);
    }

    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Код подтверждения регистрации FrysHost.',
    //   text: `Ваш код подтверждения ${code}`,
    // });
    console.log('code is', code);
    return {};

  }


  async validateActivateEmail(email: string, code: string) {
    const record = await this.activateEmailRepository.findOne({ where: { email, code } });
    if (!record) return false;

    await this.activateEmailRepository.delete(record);
    return true;
  }
}
