import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateJwtPayload, GetJwtPayload } from './interfaces/jwtPayload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionsEntity } from './entities/sessions.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(SessionsEntity) private sessionsRepository: Repository<SessionsEntity>
  ) {
    this.removeExpired();
  }

  private removeExpired() {
    this.sessionsRepository.find({
      where: {
        expiresAt: LessThanOrEqual(~~(Date.now() / 1000)),
      },
    }).then(entities => entities.forEach(entity => this.sessionsRepository.delete(entity)));

    setTimeout(() => this.removeExpired(), 24 * 60 * 60 * 1000);
  }

  generateAccessToken(jwtPayload: CreateJwtPayload) {
    return this.jwtService.sign(jwtPayload);
  }

  async generateRefreshToken(userUUID: string) {
    const expiresAt = ~~(Date.now() / 1000) + (30 * 24 * 60 * 60);
    const record = await this.sessionsRepository.save({ uuid: userUUID, expiresAt });
    const token = this.jwtService.sign({ id: record.id, uuid: userUUID }, { expiresIn: '30d' });
    return token;
  }

  async getTokensPair(userUUID: string) {
    return {
      accessToken: this.generateAccessToken({ id: 0, uuid: userUUID, type: 'access' }),
      refreshToken: await this.generateRefreshToken(userUUID),
      expiresAfter: 5 * 60,
    };
  }

  async validateRefreshToken(refreshToken: string) {
    if (!refreshToken) return false;
    if (!await this.jwtService.verifyAsync(refreshToken).catch(() => false)) return false;

    const refreshTokenData = this.jwtService.decode(refreshToken) as GetJwtPayload;

    const presentRecord = await this.sessionsRepository.findOne({ where: { id: refreshTokenData.id, uuid: refreshTokenData.uuid } });
    if (!presentRecord) return false;

    await this.sessionsRepository.delete(presentRecord);

    return refreshTokenData.uuid;
  }
}
