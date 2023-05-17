import { CanActivate, ExecutionContext, createParamDecorator, UseGuards, Inject, mixin } from '@nestjs/common';
import { isJWT, isUUID } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GetJwtPayload } from './interfaces/jwtPayload.interface';
import { ApiException } from '@system/apiException';
import secrets from '@system/secrets';
import { FastifyRequest } from 'fastify';


export const AuthGuard = (allows: { users: boolean, apiKey: boolean } = { users: true, apiKey: false }) => {
  class AuthStrategy implements CanActivate {
    constructor(
      @Inject(JwtService)
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest() as FastifyRequest & { verifiedUserUUID: string };

      const authHeader: string = request.headers.authorization;
      if (!authHeader) throw new ApiException('UNAUTHORIZED', 'AuthGuard: Need authorization');

      if (authHeader.startsWith('Bearer ')) {
        request.verifiedUserUUID = await this.clientStrategy(authHeader.replace('Bearer ', ''));
      } else {
        return false;
      }


      return true;
    }

    async clientStrategy(jwtKey: string) {
      if (!jwtKey || !isJWT(jwtKey)) throw new ApiException('UNAUTHORIZED', 'AuthGuard: Need authorization');

      const jwtPayload = await this.jwtService.verifyAsync(jwtKey, { secret: secrets.jwtSecretKey }).catch(() => false) as GetJwtPayload | false;
      if (!jwtPayload || jwtPayload.type != 'access' || !jwtPayload.uuid || !isUUID(jwtPayload.uuid)) throw new ApiException('UNAUTHORIZED', 'AuthGuard: Invalid JWT');

      if (!await this.usersService.getUser({ uuid: jwtPayload.uuid })) throw new ApiException('GONE', 'AuthGuard: Member not found');

      return jwtPayload.uuid;
    }
  }

  return UseGuards(mixin(AuthStrategy));
};


export const UserUUID = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.verifiedUserUUID ?? false;
});
