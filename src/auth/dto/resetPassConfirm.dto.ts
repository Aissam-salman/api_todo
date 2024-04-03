import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export class ResetPassConfirmDto {

    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
    })
    readonly password: string

    @IsNotEmpty()
    readonly token : string
}