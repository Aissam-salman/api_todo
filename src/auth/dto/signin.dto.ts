import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class SigninDto {
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
    })
    readonly password: string
}