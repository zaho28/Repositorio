import { Injectable } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Injectable()
export class MovimientosService {
  create(createMovimientoDto: CreateMovimientoDto) {
    console.log('service - crear movimiento:', JSON.stringify(createMovimientoDto));
    return 'Esta acción crea un nuevo movimiento';
  }

  findAll(query: any) {
    console.log('service - todos los movimientos:', JSON.stringify(query));
    return `Esta acción devuelve todos los movimientos`;
  }

  findOne(id: number) {
    console.log('service - encontrar movimiento: ID' , id);
    return `Esta acción devuelve un movimiento con ID #${id}`;
  }

  update(id: number, updateMovimientoDto: UpdateMovimientoDto) {
    console.log('service - actualizar movimiento: ID', id, { updateMovimientoDto });
    return `Esta acción actualiza un movimiento con ID #${id}`;
  }

  remove(id: number) {
    console.log('service - eliminar movimiento: ID', id);
    return `Esta acción elimina un movimiento con ID #${id}`;
  }
}
