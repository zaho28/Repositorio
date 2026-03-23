// task/task.model.ts
export class Task {
    id: number;
    titulo: string;
    descripcion: string;
    estado: 'pendiente' | 'en_proceso' | 'completado';
    id_usuario: number;
}