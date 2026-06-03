import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:gurama_online/Data/Models/comprobante_model.dart';
import 'package:gurama_online/Data/Models/carrito_model.dart';
import 'package:gurama_online/Data/Models/usuario_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ComprobanteProvider extends ChangeNotifier {

  ComprobanteModel? _ticket;
  bool _cargando = false;
  String? _error;

  ComprobanteModel? get ticket   => _ticket;
  bool get cargando         => _cargando;
  String? get error         => _error;
  bool get tieneTicket      => _ticket != null;

  // ── Crear ticket llamando al backend ─────────────────────────────────────
  Future<bool> crearTicket({
    required List<CarritoItemModel> items,
    required UsuarioModel usuario,
    required String metodoPago,
    required String token,
    String nota   = '',
    String estado = 'Pendiente',
  }) async {

    _cargando = true;
    _error = null;
    notifyListeners();

    try {
      // Construye el body para el backend
      final body = jsonEncode({
        'id_usuario': usuario.idUsuario,
        'metodo_pago': 'Mtd_PD', // Contra entrega
        'subtotal': items.fold<double>(0, (sum, item) => sum + item.subtotal),
        'total': items.fold<double>(0, (sum, item) => sum + item.subtotal),
        'items': items.map((item) => {
          'id_producto': item.producto.idProducto,
          'cantidad': item.cantidad,
          'precio': item.producto.precioUnitario,
        }).toList(),
      });

      final response = await http.post(
        Uri.parse('http://192.168.20.94:3000/pedidos/crear'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
          'x-api-key': 'xyz123',
        },
        body: body,
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final pedidoData = data['data'];

        // Crea el ticket local con los datos reales del backend
        final subtotal = items.fold<double>(0, (sum, item) => sum + item.subtotal);

        _ticket = ComprobanteModel(
          numTicket    : '${pedidoData['num_ticket']}',
          idPedido     : pedidoData['id_pedido'],
          fechaEmision : _fechaFormateada(),
          cliente      : usuario.nombreCompleto,
          idUsuario    : usuario.idUsuario,
          correo       : usuario.correo,
          telefono     : usuario.telefono,
          productos    : items.map((e) => e.producto).toList(),
          subtotal     : subtotal,
          total        : subtotal,
          metodoPago   : metodoPago,
          estado       : estado,
          nota         : nota,
        );

        _cargando = false;
        notifyListeners();
        return true; // éxito

      } else {
        final error = jsonDecode(response.body);
        _error = error['message'] ?? 'Error al crear el pedido';
        _cargando = false;
        notifyListeners();
        return false;
      }

    } catch (e) {
      _error = 'Error de conexión: $e';
      _cargando = false;
      notifyListeners();
      return false;
    }
  }

  void limpiarTicket() {
    _ticket = null;
    _error  = null;
    notifyListeners();
  }

  String generarTextoCompartir() {
    if (_ticket == null) return '';
    final t = _ticket!;
    final buffer = StringBuffer();
    buffer.writeln('COMPROBANTE DE PEDIDO - GURAMA ONLINE');
    buffer.writeln('Ticket   : ${t.numTicket}');
    buffer.writeln('Pedido   : #${t.idPedido}');
    buffer.writeln('Fecha    : ${t.fechaEmision}');
    buffer.writeln('─────────────────────────────');
    buffer.writeln('CLIENTE');
    buffer.writeln('Nombre   : ${t.cliente}');
    buffer.writeln('Correo   : ${t.correo}');
    buffer.writeln('Teléfono : ${t.telefono}');
    buffer.writeln('─────────────────────────────');
    buffer.writeln('PRODUCTOS');
    for (final p in t.productos) {
      buffer.writeln('• ${p.nomProducto} → ${p.precioFormateado}');
    }
    buffer.writeln('─────────────────────────────');
    buffer.writeln('Subtotal : \$${_fmt(t.subtotal)}');
    buffer.writeln('TOTAL    : \$${_fmt(t.total)}');
    buffer.writeln('─────────────────────────────');
    buffer.writeln('Pago  : ${t.metodoPago}');
    buffer.writeln('Estado: ${t.estado}');
    if (t.nota.isNotEmpty) buffer.writeln('Nota  : ${t.nota}');
    return buffer.toString();
  }

  Future<void> copiarAlPortapapeles() async {
    await Clipboard.setData(ClipboardData(text: generarTextoCompartir()));
  }

  // ── Helpers privados ──────────────────────────────────────────────────────
  String _fechaFormateada() {
    final n = DateTime.now();
    return '${n.day.toString().padLeft(2,'0')}/'
        '${n.month.toString().padLeft(2,'0')}/'
        '${n.year}  '
        '${n.hour.toString().padLeft(2,'0')}:'
        '${n.minute.toString().padLeft(2,'0')}';
  }

  String _fmt(double valor) {
    return valor.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]}.',
    );
  }
}