import 'package:flutter/material.dart';
import 'package:gurama_online/Data/Models/carrito_model.dart';
import 'package:gurama_online/Data/Models/producto_model.dart';

// ChangeNotifier = permite notificar a la UI cuando el carrito cambia
class CarritoProvider extends ChangeNotifier {
  // Lista privada de items en el carrito
  final List<CarritoItemModel> _items = [];

  // Getter público para leer los items
  List<CarritoItemModel> get items => List.unmodifiable(_items);

  // Total de productos en el carrito
  int get totalProductos => _items.fold(0, (sum, item) => sum + item.cantidad);

  // Total a pagar
  double get total => _items.fold(0, (sum, item) => sum + item.subtotal);

  // Total formateado
  String get totalFormateado => '\$${total.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]}.',
  )}';

  // Agregar producto al carrito
  void agregar(ProductoModel producto) {
    final index = _items.indexWhere((item) => item.producto.idProducto == producto.idProducto);
    if (index >= 0) {
      _items[index].cantidad++;
    } else {
      _items.add(CarritoItemModel(producto: producto));
    }
    notifyListeners();
  }

  // Aumentar cantidad
  void aumentarCantidad(int idProducto) {
    final index = _items.indexWhere((item) => item.producto.idProducto == idProducto);
    if (index >= 0) {
      if (_items[index].cantidad < _items[index].producto.stockActual) {
        _items[index].cantidad++;
        notifyListeners();
      }
    }
  }

  // Disminuir cantidad
  void disminuirCantidad(int idProducto) {
    final index = _items.indexWhere((item) => item.producto.idProducto == idProducto);
    if (index >= 0) {
      if (_items[index].cantidad > 1) {
        _items[index].cantidad--;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
    }
  }

  // Eliminar item
  void eliminar(int idProducto) {
    _items.removeWhere((item) => item.producto.idProducto == idProducto);
    notifyListeners();
  }

  // Vaciar carrito
  void vaciar() {
    _items.clear();
    notifyListeners();
  }

  // Verificar si un producto está en el carrito
  bool estaEnCarrito(int idProducto) {
    return _items.any((item) => item.producto.idProducto == idProducto);
  }
}