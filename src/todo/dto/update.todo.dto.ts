import { IsBoolean, IsString } from "class-validator"

export class UpdateTodoDto {
    @IsString()
    readonly desc?: string

    @IsBoolean()
    readonly completed?: boolean
}