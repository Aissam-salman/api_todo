import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class SignupDto {
    @IsNotEmpty()
    readonly username: string

    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
    })
    readonly password: string
}