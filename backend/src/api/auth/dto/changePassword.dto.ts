import { IsNotEmpty, IsUrl } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    readonly old_password: string;

    @IsNotEmpty()
    readonly new_password: string;

    @IsUrl()
    readonly redirectUrl: string;
}
