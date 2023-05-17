import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { DiscordConfirmationEntity } from './entities/discordConfirmation.entity';
import { UsersModule } from 'api/users/users.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DiscordConfirmationEntity,
    ]),
    UsersModule,
  ],
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
