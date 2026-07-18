import 'package:gurama_online/Data/Models/producto_model.dart';
class ComprobanteModel {
  final String numTicket;
  final int idPedido;
  final String fechaEmision;

  //cliente
  final String cliente;
  final String idUsuario;
  final String correo;
  final String telefono;

  //productos
  final List<ProductoModel> productos;

  //totales
  final double subtotal;
  final double total;

  //pago
  final String metodoPago;
  final String estado;
  final String nota;

  ComprobanteModel({
    required this.numTicket,
    required this.idPedido,
    required this.fechaEmision,
    required this.cliente,
    required this.idUsuario,
    required this.correo,
    required this.telefono,
    required this.productos,
    required this.subtotal,
    required this.total,
    required this.metodoPago,
    required this.estado,
    required this.nota,
  });

  factory ComprobanteModel.fromJson(Map<String, dynamic> json) {
    return ComprobanteModel(
      numTicket: json['num_ticket'] ??'',
      idPedido: json['id_pedido'] ?? 0,
      fechaEmision: json['fecha_emision'] ??'',

      cliente: json['cliente'] ??'',
      idUsuario: json['id_usuario'] ??'',
      correo: json['correo'] ??'',
      telefono: json['telefono'] ??'',

      productos: (json['productos'] as List<dynamic>)
        ?.map((item) => ProductoModel.fromJson(item))
        .toList() ??
        [],

      subtotal: (json['subtotal'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),

      metodoPago: json['metodo_pago'] ??'',
      estado: json['estado'] ??'',
      nota: json['nota'] ??'',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'num_ticket': numTicket,
      'id_pedido': idPedido,
      'fecha_emision': fechaEmision,

      'cliente': cliente,
      'id_usuario': idUsuario,
      'correo': correo,
      'telefono': telefono,

      'productos': productos.map((e) => e.toJson()).toList(),

      'subtotal': subtotal,
      'total': total,

      'metodo_pago': metodoPago,
      'estado': estado,
      'nota': nota,
    };
  }
}