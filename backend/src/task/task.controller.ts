// task/task.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    // GET /task
    @Get()
    findAll(@Query() query: any) {
        console.log('CONTROLLER - GET /task, query:', JSON.stringify(query));
        return this.taskService.findAll();
    }

    // GET /task/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        console.log('CONTROLLER - GET /task/:id, id:', id);
        return this.taskService.findOne(+id);
    }

    // POST /task
    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        console.log('CONTROLLER - POST /task, body:', JSON.stringify(createTaskDto));
        return this.taskService.create(createTaskDto);
    }
    
}