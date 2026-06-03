class MaterialModel {
  final int idMaterial;
  final String nombre;
  final String tipo;
  final String unidad;
  final double precioUnitario;
  final int stockActual;
  final String? rutaImagen;

  MaterialModel({
    required this.idMaterial,
    required this.nombre,
    required this.tipo,
    required this.unidad,
    required this.precioUnitario,
    required this.stockActual,
    this.rutaImagen,
  });

  factory MaterialModel.fromJson(Map<String, dynamic> json) {
    return MaterialModel(
      idMaterial     : json['id_material'],
      nombre         : json['nombre'] ?? '',
      tipo           : json['tipo'] ?? '',
      unidad         : json['unidad'] ?? '',
      precioUnitario : (json['precio_unitario'] ?? 0).toDouble(),
      stockActual    : json['stock_actual'] ?? 0,
      rutaImagen     : json['ruta_imagen'],
    );
  }

  bool get disponible => stockActual > 0;

  String get precioFormateado =>
  '\$${precioUnitario.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}/metro';
}

class ColorModel {
  final int idColor;
  final String nombre;
  final String codigoHex;

  ColorModel({required this.idColor, required this.nombre, required this.codigoHex});

  factory ColorModel.fromJson(Map<String, dynamic> json) {
    return ColorModel(
      idColor   : json['id_color'],
      nombre    : json['nombre'] ?? '',
      codigoHex : json['codigo_hex'] ?? '#000000',
    );
  }

  int get colorValue {
    final hex = codigoHex.replaceAll('#', '');
    return int.parse('FF$hex', radix: 16);
  }
}

class DisenoModel {
  final int idDiseno;
  final String nombre;
  final String? rutaImagen;

  DisenoModel({required this.idDiseno, required this.nombre, this.rutaImagen});

  factory DisenoModel.fromJson(Map<String, dynamic> json) {
    return DisenoModel(
      idDiseno   : json['id_diseno'],
      nombre     : json['nombre'] ?? '',
      rutaImagen : json['ruta_imagen'],
    );
  }
}

// ── Tamaños de Sábana con metros de tela ─────────────────────────────────────
class TamanioSabana {
  final String nombre;
  final String medidas;
  final double metros; // metros base de tela

  const TamanioSabana({required this.nombre, required this.medidas, required this.metros});
}

const List<TamanioSabana> tamaniosSabana = [
  TamanioSabana(nombre: 'Cuna',         medidas: '100 x 145 cm', metros: 4),
  TamanioSabana(nombre: 'Individual',   medidas: '180 x 275 cm', metros: 6),
  TamanioSabana(nombre: 'Doble',        medidas: '230 x 275 cm', metros: 8),
  TamanioSabana(nombre: 'Rey',          medidas: '275 x 275 cm', metros: 9),
  TamanioSabana(nombre: 'Rey europeo',  medidas: '300 x 275 cm', metros: 10),
  TamanioSabana(nombre: 'Emperador',    medidas: '320 x 290 cm', metros: 12),
];

// ── Tamaños de Cubrelecho con metros de tela ─────────────────────────────────
class TamanioCubrelecho {
  final String nombre;
  final double metros; // metros totales (los dos lados se dividen entre 2)

  const TamanioCubrelecho({required this.nombre, required this.metros});
}

const List<TamanioCubrelecho> tamaniosCubrelecho = [
  TamanioCubrelecho(nombre: 'Sencilla',    metros: 5),
  TamanioCubrelecho(nombre: 'Semidobe',    metros: 6),
  TamanioCubrelecho(nombre: 'Doble',       metros: 7),
  TamanioCubrelecho(nombre: 'Queen',       metros: 8),
  TamanioCubrelecho(nombre: 'King',        metros: 10),
];

// ── Respuesta del backend ─────────────────────────────────────────────────────
class PedidoPersonalizadoRespuesta {
  final bool success;
  final String message;
  final int idPedido;
  final int numTicket;
  final double precioTotal;
  final String tipoProducto;
  final String tamanio;

  PedidoPersonalizadoRespuesta({
    required this.success,
    required this.message,
    required this.idPedido,
    required this.numTicket,
    required this.precioTotal,
    required this.tipoProducto,
    required this.tamanio,
  });

  factory PedidoPersonalizadoRespuesta.fromJson(Map<String, dynamic> json) {
    return PedidoPersonalizadoRespuesta(
      success      : json['success'] ?? false,
      message      : json['message'] ?? '',
      idPedido     : json['id_pedido'] ?? 0,
      numTicket    : json['num_ticket'] ?? 0,
      precioTotal  : (json['precio_total'] ?? 0).toDouble(),
      tipoProducto : json['tipo_producto'] ?? '',
      tamanio      : json['tamanio'] ?? '',
    );
  }

  String get precioFormateado =>
  '\$${precioTotal.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
}