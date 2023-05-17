import { IsNotEmpty } from "class-validator";

export default class CallbackQueryDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  state: string;
}