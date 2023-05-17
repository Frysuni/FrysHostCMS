import { IsEmail, IsUrl } from 'class-validator';

export class ResetDto {
    @IsEmail()
    readonly email: string;

    @IsUrl()
    readonly redirect_url: string;
}
