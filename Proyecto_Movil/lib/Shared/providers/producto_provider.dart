import 'dart:convert';
import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../services/api_service.dart';
import '../../data/models/producto_model.dart';

class ProductoProvider extends ChangeNotifier {
  List<ProductoModel> _productos = [];
  bool _cargando = false;
  String? _error;

  List<ProductoModel> get productos => _productos;
  bool get cargando => _cargando;
  String? get error => _error;

  Future<void> cargarProductos() async {
    try {
      _cargando = true;
      _error = null;
      notifyListeners();

      print('TOKEN EN APISERVICE: ${ApiService.currentToken}');

      final res = await ApiService.get(AppConstants.obtenerProductos);

      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _productos = data.map((e) => ProductoModel.fromJson(e)).toList();
      } else {
        _error = 'Error al cargar productos';
      }
    } catch (e) {
      _error = 'Error de conexión';
    } finally {
      _cargando = false;
      notifyListeners();
    }
  }

  void agregarProducto(Map<String, dynamic> json) {
    _productos.insert(0, ProductoModel.fromJson(json));
    notifyListeners();
  }

  void limpiarError() {
    _error = null;
    notifyListeners();
  }
}