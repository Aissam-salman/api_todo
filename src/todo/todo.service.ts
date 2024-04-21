import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create.todo.dto.js';
import { Todo } from '@prisma/client';
import { UpdateTodoDto } from './dto/update.todo.dto.js';


type Rep = {
    data: string
}

type PatchTodo = {
    desc?: string,
    completed?: boolean
}

@Injectable()
export class TodoService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async create(createTodoDto: CreateTodoDto, userId: number): Promise<Rep> {

        const { desc, completed } = createTodoDto
        try {
            await this.prismaService.todo.create({
                data: {
                    desc: desc,
                    completed: completed,
                    authorId: userId,
                }
            })
            return {
                data: "Todo created success"
            }
        } catch (e) {
            return { data: "error for created todo" }
        }
    }

    async findAll(userId: number): Promise<Todo[]> {
        return await this.prismaService.todo.findMany({ where: { authorId: userId } })
    }

    async findAllCompleted(userId: any): Promise<Todo[]> {
        return await this.prismaService.todo.findMany({
            where: {
                AND: [
                    { authorId: userId },
                    { completed: true },
                ],
            },
        })
    }

    async findAllUnCompleted(userId: any): Promise<Todo[]> {
        return await this.prismaService.todo.findMany({
            where: {
                AND: [
                    { authorId: userId },
                    { completed: false },
                ],
            },
        })
    }

    async findTodoById(todoId: number): Promise<Todo> {
        return await this.prismaService.todo.findUnique({ where: { todoId: todoId } })
    }

    async updateTodo(todoId: number, updateTodoDto: UpdateTodoDto) {

        const { desc, completed } = updateTodoDto;

        let updateTodo: PatchTodo = {};

        if (desc !== undefined || desc.trim() !== '') {
            updateTodo.desc = desc;
        }

        if (completed !== undefined) {
            updateTodo.completed = completed;
        }

        const updatedTodo = await this.prismaService.todo.update({
            where: {
                todoId: todoId,
            },
            data: updateTodo,
        })


        return {message: `Todo n°${todoId} is updated`, todo: updatedTodo}
    }

    async deleteTodo(todoId: number) {
        await this.prismaService.todo.delete({
            where: {todoId: todoId}
        })
        return {data: `Todo n°${todoId} is deleted`}
    }


}
