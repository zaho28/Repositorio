import 'package:gurama_online/Data/Models/producto_model.dart';

// Representa un item dentro del carrito
// Un item = un producto + la cantidad que el usuario quiere comprar
class CarritoItemModel {
  final ProductoModel producto; // El producto
  int cantidad;                 // Cuántas unidades quiere el usuario

  CarritoItemModel({
    required this.producto,
    this.cantidad = 1, // Por defecto agrega 1 unidad
  });

  // Subtotal de este item = precio * cantidad
  double get subtotal => producto.precioUnitario * cantidad;

  // Subtotal formateado para mostrar en la UI
  String get subtotalFormateado => '\$${subtotal.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]}.',
  )}';
}