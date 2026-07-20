import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../Data/models/carrito_model.dart';
import '../../Data/models/comprobante_model.dart';
import '../../Data/models/usuario_model.dart';
import '../constants/app_constants.dart';
import 'package:http/http.dart' as http;

class ComprobanteProvider extends ChangeNotifier {
    ComprobanteModel? _ticket;
    String? _error;
    bool _cargando = false;

    ComprobanteModel? get ticket => _ticket;
    String? get error => _error;
    bool get cargando => _cargando;

    Future<bool> crearTicket({
        required List<CarritoItemModel> items,
        required UsuarioModel usuario,
        required String metodoPago,
        required String token,
        String nota = '',
    }) async {
        _cargando = true;
        _error = null;
        notifyListeners();

        try {
        final productos = items
            .map((item) => {
                    'id_producto': item.producto.idProducto,
                    'cantidad': item.cantidad,
                    'precio_unitario': item.producto.precioUnitario,
                })
            .toList();

        final response = await http.post(
            Uri.parse(AppConstants.crearPedido),
            headers: {
            'Content-Type': 'application/json',
            'x-api-key': AppConstants.apiKey,
            'Authorization': 'Bearer $token',
            },
            body: jsonEncode({
            'id_usuario': usuario.idUsuario,
            'metodo_pago': metodoPago,
            'nota': nota,
            'productos': productos,
            }),
        );

        _cargando = false;

        if (response.statusCode == 200 || response.statusCode == 201) {
            final data = jsonDecode(response.body);
            _ticket = ComprobanteModel.fromJson(data);
            notifyListeners();
            return true;
        } else {
            final data = jsonDecode(response.body);
            _error = data['message']?.toString() ?? 'Error al crear el pedido';
            notifyListeners();
            return false;
        }
        } catch (e) {
        _cargando = false;
        _error = 'Error de conexión: $e';
        notifyListeners();
        return false;
        }
    }

    void limpiarTicket() {
        _ticket = null;
        _error = null;
        notifyListeners();
    }

    Future<void> copiarAlPortapapeles() async {
        if (_ticket == null) return;
        final texto = '''
    GURAMA ONLINE - Comprobante de Pedido
    =====================================
    Ticket: #${_ticket!.numTicket}
    Pedido: #${_ticket!.idPedido}
    Fecha: ${_ticket!.fechaEmision}

    CLIENTE
    -------
    Nombre: ${_ticket!.cliente}
    Correo: ${_ticket!.correo}
    Teléfono: ${_ticket!.telefono}

    PRODUCTOS
    ---------
    ${_ticket!.productos.map((p) => '${p.nomProducto} - ${p.precioFormateado}').join('\n')}

    TOTAL: ${'\$${_ticket!.total.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}'}

    Método de pago: ${_ticket!.metodoPago}
    Estado: ${_ticket!.estado}
    =====================================
        ''';
        await Clipboard.setData(ClipboardData(text: texto));
    }
}