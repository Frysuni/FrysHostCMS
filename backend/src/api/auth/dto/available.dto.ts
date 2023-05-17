import { IsEmail, IsOptional } from "class-validator";

export class AvailableQueryDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  readonly username?: string;

  @IsOptional()
  readonly memberId: string;
}