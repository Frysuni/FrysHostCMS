import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { AssetsService } from './assets.service';
import { AssetsEntity } from './entities/assets.entity';
import secrets from '@system/secrets';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, AssetsEntity]), JwtModule.register({ secret: secrets.jwtSecretKey })],
  controllers: [UsersController],
  providers: [UsersService, AssetsService],
  exports: [UsersService],
})
export class UsersModule {}
