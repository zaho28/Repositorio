import 'producto_model.dart';

class ComprobanteModel {
    final String numTicket;
    final int idPedido;
    final String fechaEmision;
    final String cliente;
    final String idUsuario;
    final String correo;
    final String telefono;
    final List<ProductoModel> productos;
    final double subtotal;
    final double total;
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
        numTicket:    json['num_ticket']   ?? '',
        idPedido:     json['id_pedido']    ?? 0,
        fechaEmision: json['fecha_emision'] ?? '',
        cliente:      json['cliente']      ?? '',
        idUsuario:    json['id_usuario']   ?? '',
        correo:       json['correo']       ?? '',
        telefono:     json['telefono']?.toString() ?? '',
        productos: (json['productos'] as List<dynamic>? ?? [])
            .map((item) => ProductoModel.fromJson(item))
            .toList(),
        subtotal:   (json['subtotal']  ?? 0).toDouble(),
        total:      (json['total']     ?? 0).toDouble(),
        metodoPago: json['metodo_pago'] ?? '',
        estado:     json['estado']     ?? '',
        nota:       json['nota']       ?? '',
        );
    }
}