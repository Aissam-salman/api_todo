import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateTodoDto {
    @IsNotEmpty()
    @IsString()
    readonly desc: string

    @IsBoolean()
    readonly completed?: boolean

    @IsInt()
    @IsNotEmpty()
    readonly authorId: number
}
