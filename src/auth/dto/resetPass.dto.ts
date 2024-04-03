import { IsEmail } from "class-validator"

export class ResetPassDto {
    @IsEmail()
    readonly email: string
}