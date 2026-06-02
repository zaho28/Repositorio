import 'dart:convert';
import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../services/api_service.dart';
import '../../Data/models/pedido_model.dart';

class PedidoProvider extends ChangeNotifier {
  List<PedidoModel> _pedidos = [];
  bool _cargando = false;
  String? _error;

  List<PedidoModel> get pedidos => _pedidos;
  bool get cargando => _cargando;
  String? get error => _error;

  Future<void> cargarPedidos() async {
    try {
      _cargando = true;
      _error = null;
      notifyListeners();

      final res = await ApiService.get(AppConstants.obtenerPedidos);

      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _pedidos = data.map((e) => PedidoModel.fromJson(e)).toList();
      } else {
        _error = 'Error al cargar pedidos';
      }
    } catch (e) {
      _error = 'Error de conexión';
    } finally {
      _cargando = false;
      notifyListeners();
    }
  }

  Future<PedidoModel?> obtenerDetalle(int idPedido) async {
    try {
      final url = '${AppConstants.detallePedido}/$idPedido';
      final res = await ApiService.get(url);
      if (res.statusCode == 200) {
        return PedidoModel.fromJson(jsonDecode(res.body));
      }
    } catch (e) {
      print('Error obteniendo detalle: $e');
    }
    return null;
  }

  Future<bool> actualizarEstado(int idPedido, String nuevoEstado) async {
    try {
      final url = '${AppConstants.actualizarPedido}/$idPedido';
      final res = await ApiService.patch(url, {'estado': nuevoEstado});
      if (res.statusCode == 200) {
        await cargarPedidos();
        return true;
      }
    } catch (e) {
      print('Error actualizando estado: $e');
    }
    return false;
  }

  Future<bool> actualizarMetodoPago(PedidoModel pedido, String nuevoMetodo, String userId) async {
    try {
      final url = '${AppConstants.actualizarPedido}/${pedido.idPedido}';
      final res = await ApiService.patch(url, {'metodo_pago': nuevoMetodo});
      
      if (res.statusCode == 200) {
        // Si no es por definir y es un pedido estándar, registrar salidas de inventario
        if (nuevoMetodo != 'Por_definir' && !pedido.esPersonalizado) {
          final detalleCompleto = await obtenerDetalle(pedido.idPedido);
          if (detalleCompleto != null) {
            for (var item in detalleCompleto.detalles) {
              await ApiService.post(AppConstants.crearMovimiento, {
                'Cantidad_m': item.cantidad,
                'observaciones': 'PEDIDO #${pedido.idPedido} - Pago registrado ($nuevoMetodo)',
                'id_m': 'M_S',
                'id_producto': item.idProducto,
                'id_usuario': userId,
              });
            }
          }
        }
        await cargarPedidos();
        return true;
      }
    } catch (e) {
      print('Error actualizando método de pago: $e');
    }
    return false;
  }
}
