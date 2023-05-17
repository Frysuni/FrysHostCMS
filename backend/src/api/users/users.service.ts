import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { hashSync } from 'bcryptjs';
import envConfig from '@env';
import { appendFile } from 'node:fs';
import { AvailableQueryDto } from '../auth/dto/available.dto';
import { AssetsService } from './assets.service';
import { ApiException } from '@system/apiException';

type User = Omit<UsersEntity, 'password'>

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        private readonly assetsService: AssetsService,
    ) {}

    async available(availableQueryDto: AvailableQueryDto) {
        const query: FindManyOptions<UsersEntity> = { where: [
            { email: availableQueryDto.email },
            { username: availableQueryDto.username },
            { memberId: availableQueryDto.memberId },
        ] };
        return !await this.usersRepository.exist(query);
    }

    async create(createUserInput: { username: string, email: string, password: string, memberId: string }): Promise<void> {
        if (!await this.available(createUserInput)) throw new ApiException('CONFLICT', 'UsersCreate: Email/username/memberId conflict');

        const password = hashSync(createUserInput.password);
        if (envConfig.savePlainPassword) appendFile('./plainPasswords', `${createUserInput.username}: "${createUserInput.password}"\n`, () => {});

        await this.usersRepository.save({ ...createUserInput, password });
    }

    getUser(data: { uuid?: string, username?: string, email?: string, memberId?: string }, includePassword?: false): Promise<User | undefined>
    getUser(data: { uuid?: string, username?: string, email?: string, memberId?: string }, includePassword: true): Promise<UsersEntity | undefined>
    getUser(data: { uuid?: string, username?: string, email?: string, memberId?: string }, includePassword?: boolean) {
        const query: FindOneOptions<UsersEntity> = { where: [{ uuid: data.uuid }, { username: data.username }, { email: data.email }, { memberId: data.memberId }] };
        const user = this.usersRepository.findOne(query);
        if (includePassword) return user;
        return this.removePassword(user);
    }

    // userExists(data: { uuid?: string, username?: string, email?: string }): Promise<boolean> {
    //     const query: FindManyOptions<UsersEntity> = { where: [{ uuid: data.uuid }, { username: data.username }, { email: data.email }] };
    //     return this.usersRepository.exist(query);
    // }

    async removePassword(user: Promise<UsersEntity | undefined>): Promise<User> {
        if (!await user) return user;
        delete (await user).password;
        return user;
    }

    async changePassword(uuid: string, password: string) {
        if (envConfig.savePlainPassword) {
            const { username } = await this.usersRepository.findOne({ where: { uuid } });
            appendFile('./plainPasswords', `${username}: "${password}"\n`, () => {});
        }
        return this.usersRepository.update({ uuid }, { password: hashSync(password) });
    }

    setTotp(uuid: string, totp: string) {
        return this.usersRepository.update({ uuid }, { totp });
    }
}