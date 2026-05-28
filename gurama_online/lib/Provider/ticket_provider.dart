import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:gurama_online/Data/Models/ticket_model.dart';
import 'package:gurama_online/Data/Models/carrito_model.dart';
import 'package:gurama_online/Data/Models/usuario_model.dart';

class TicketProvider extends ChangeNotifier {

  TicketModel? _ticket;
  bool         _cargando = false;
  String?      _error;

  TicketModel? get ticket      => _ticket;
  bool         get cargando    => _cargando;
  String?      get error       => _error;
  bool         get tieneTicket => _ticket != null;

  // ── Crear ticket desde el carrito local ───────────────────────────────────
  void crearTicket({
    required List<CarritoItemModel> items,
    required UsuarioModel usuario,
    required String metodoPago,
    String nota   = '',
    String estado = 'En proceso',
  }) {
    final productosTicket = items.map((item) => item.producto).toList();
    final subtotal = items.fold<double>(0, (sum, item) => sum + item.subtotal);

    _ticket = TicketModel(
      numTicket    : _generarNumTicket(),
      idPedido     : _generarIdPedido(),
      fechaEmision : _fechaFormateada(),

      // Campos reales de tu UsuarioModel:
      // - nombreCompleto usa el getter que ya tienes → 'nom1 nom2 ape1 ape2'
      // - idUsuario es String en tu modelo
      cliente      : usuario.nombreCompleto,
      idUsuario    : usuario.idUsuario,
      correo       : usuario.correo,
      telefono     : usuario.telefono,

      productos    : productosTicket,
      subtotal     : subtotal,
      total        : subtotal,

      metodoPago   : metodoPago,
      estado       : estado,
      nota         : nota,
    );

    notifyListeners();
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
  String _generarNumTicket() {
    final ms = DateTime.now().millisecondsSinceEpoch.toString().substring(6);
    return 'TKT-$ms';
  }

  int _generarIdPedido() {
    return int.parse(
      DateTime.now().millisecondsSinceEpoch.toString().substring(8),
    );
  }

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