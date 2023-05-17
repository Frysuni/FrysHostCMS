import { AxiosError } from "axios";

enum ApiErrorKeeper {
  'ValidationPipe: Wrong DTO recived',
  'AuthGuard: Need authorization',
  'AuthGuard: Invalid JWT',
  'AuthGuard: Member not found',
  'AuthAvailable: Username or email is not specified',
  'AuthRegister: Invalid email activation code. (Or email not the same)',
  'AuthRegister: Invalid discord authorization token',
  'AuthLogin: Invalid usernameOrEmail or password',
  'AuthRefresh: Invalid refresh token',
  'DiscordAuthCallbackHandler: Invalid state token',
  'UsersCreate: Email or username conflict'
}

export type ApiError = AxiosError<
  { code: ApiErrorKeeper, description: keyof typeof ApiErrorKeeper, errors?: string[] } |
  { statusCode: number, message: string }
>;

export function matchError(errorInstance: ApiError, description: keyof typeof ApiErrorKeeper): boolean {
  const data = errorInstance.response?.data;
  if (!data) return false;
  if (!data) return false;
  // if (errorInstance.response?.data?.message?.code !== ApiErrorKeeper[description]) return false;
  // if (errorInstance.response?.data?.message?.description !== description) return false;
  return true;
}