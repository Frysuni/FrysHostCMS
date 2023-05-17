import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    readonly usernameOrEmail: string;

    @IsNotEmpty()
    readonly password: string;
}
