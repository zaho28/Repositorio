// task/task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

    private tasks: Task[] = [
        { id: 1, titulo: 'Reabastecer producto 1', descripcion: 'Stock bajo', estado: 'pendiente', id_usuario: 1 },
        { id: 2, titulo: 'Revisar pedido 5', descripcion: 'Pedido con problema', estado: 'en_proceso', id_usuario: 2 },
    ];

    findAll() {
        console.log('SERVICE - findAll tasks:', JSON.stringify(this.tasks));
        return this.tasks;
    }

    findOne(id: number) {
        console.log('SERVICE - findOne task id:', id);
        const task = this.tasks.find(t => t.id === id);
        if (!task) throw new NotFoundException(`Task ${id} no encontrada`);
        return task;
    }

    create(dto: CreateTaskDto) {
        console.log('SERVICE - create task:', JSON.stringify(dto));
        const nueva: Task = {
            id: this.tasks.length + 1,
            ...dto,
        };
        this.tasks.push(nueva);
        return nueva;
    }
}