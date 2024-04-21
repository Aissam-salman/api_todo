import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { TodoService } from "./todo.service.js";
import { AuthGuard } from "@nestjs/passport";
import { CreateTodoDto } from "./dto/create.todo.dto.js";
import { Request } from "express";
import { Todo } from "@prisma/client";
import { UpdateTodoDto } from "./dto/update.todo.dto.js";


@Controller("todos")
@UseGuards(AuthGuard("jwt"))
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    findAll(@Req() request: Request): Promise<Todo[]> {
        const userId = request.user["userId"]
        return this.todoService.findAll(userId);
    }

    @Post()
    create(@Body() createTodoDto: CreateTodoDto, @Req() request: Request) {
        const userId = request.user["userId"];
        return this.todoService.create(createTodoDto, userId);
    }

    @Get(":id")
    findTodoById(@Param("id") id: string) {
        return this.todoService.findTodoById(+id);
    }

    @Patch(":id")
    updateTodo(@Param("id") id: string, @Body() updataTodoDto: UpdateTodoDto) {
        return this.todoService.updateTodo(+id, updataTodoDto);
    }

    @Delete(":id")
    deleteTodo(@Param("id") id: string) {
        return this.todoService.deleteTodo(+id);
    }

    @Get("completed")
    findAllCompleted(@Req() request: Request): Promise<Todo[]> {
        const userId = request.user["userId"]
        return this.todoService.findAllCompleted(userId)
    }

    @Get("uncompleted")
    findAllUnCompleted(@Req() request: Request): Promise<Todo[]> {
        const userId = request.user["userId"]
        return this.todoService.findAllUnCompleted(userId)
    }

    /**
     *
     * // TODO: affiner le CRUD
     *
        GET /todos/completed : Pour récupérer les tache fini
        GET /todos/uncompleted : Pour récupérer les tache non-fini

     *
     *
     *
        GET /todos: Pour récupérer toutes les tâches de l"utilisateur connecté.
        GET /todos/:id : Pour récupérer une tâche spécifique par son ID.
        POST /todos : Pour créer une nouvelle tâche.
        PUT /todos/:id : Pour mettre à jour une tâche existante.
        DELETE /todos/:id : Pour supprimer une tâche.
     *
    */

}
