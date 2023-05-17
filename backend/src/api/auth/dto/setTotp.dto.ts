import { IsNotEmpty } from "class-validator";

export class SetTotpDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  code: string;
}