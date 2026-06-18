import 'package:flutter/material.dart';
import '../../Data/models/carrito_model.dart';
import '../../Data/models/producto_model.dart';

class CarritoProvider extends ChangeNotifier {
    final List<CarritoItemModel> _items = [];

    List<CarritoItemModel> get items => List.unmodifiable(_items);
    int get totalProductos => _items.fold(0, (sum, item) => sum + item.cantidad);
    double get total => _items.fold(0, (sum, item) => sum + item.subtotal);

    String get totalFormateado => '\$${total.toStringAsFixed(0).replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';

    void agregar(ProductoModel producto) {
        final index = _items.indexWhere(
            (item) => item.producto.idProducto == producto.idProducto);
        if (index >= 0) {
        _items[index].cantidad++;
        } else {
        _items.add(CarritoItemModel(producto: producto));
        }
        notifyListeners();
    }

    void aumentarCantidad(int idProducto) {
        final index = _items.indexWhere(
            (item) => item.producto.idProducto == idProducto);
        if (index >= 0 &&
            _items[index].cantidad < _items[index].producto.stockActual) {
        _items[index].cantidad++;
        notifyListeners();
        }
    }

    void disminuirCantidad(int idProducto) {
        final index = _items.indexWhere(
            (item) => item.producto.idProducto == idProducto);
        if (index >= 0) {
        if (_items[index].cantidad > 1) {
            _items[index].cantidad--;
        } else {
            _items.removeAt(index);
        }
        notifyListeners();
        }
    }

    void eliminar(int idProducto) {
        _items.removeWhere((item) => item.producto.idProducto == idProducto);
        notifyListeners();
    }

    void vaciar() {
        _items.clear();
        notifyListeners();
    }

    bool estaEnCarrito(int idProducto) =>
        _items.any((item) => item.producto.idProducto == idProducto);
}