class ProductoModel {
  final int idProducto;
  final String nomProducto;
  final double precioUnitario;
  final int stockActual;
  final int stockMinimo;
  final String? color;
  final String? talla;
  final String? tamanio;
  final String descripcion;
  final int idCategoria;
  final int idClasificacion;
  final String? rutaImagen;
  final bool? estado;
  final String? nombreCategoria;
  final String? nombreClasificacion;

  ProductoModel({
    required this.idProducto,
    required this.nomProducto,
    required this.precioUnitario,
    required this.stockActual,
    required this.stockMinimo,
    this.color,
    this.talla,
    this.tamanio,
    required this.descripcion,
    required this.idCategoria,
    required this.idClasificacion,
    this.rutaImagen,
    this.estado,
    this.nombreCategoria,
    this.nombreClasificacion,
  });

  factory ProductoModel.fromJson(Map<String, dynamic> json) {
    return ProductoModel(
      idProducto: json['id_producto'],
      nomProducto: json['nom_producto'],
      precioUnitario: double.parse(json['precio_unitario'].toString()),
      stockActual: json['stock_actual'],
      stockMinimo: json['stock_minimo'],
      color: json['color'],
      talla: json['talla'],
      tamanio: json['tamaño'],
      descripcion: json['descripcion'],
      idCategoria: json['id_categoria'],
      idClasificacion: json['id_clasificacion'],
      rutaImagen: json['ruta_imagen'],
      estado: json['estado'],
      nombreCategoria: json['categoria']?['nombre_c'],
      nombreClasificacion: json['clasificacion']?['nombre_clas'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_producto': idProducto,
      'nom_producto': nomProducto,
      'precio_unitario': precioUnitario,
      'stock_actual': stockActual,
      'stock_minimo': stockMinimo,
      'color': color,
      'talla': talla,
      'tamaño': tamanio,
      'descripcion': descripcion,
      'id_categoria': idCategoria,
      'id_clasificacion': idClasificacion,
      'ruta_imagen': rutaImagen,
      'estado': estado,
    };
  }

  // Lógica que antes estaba en la entity
  String get precioFormateado => '\$${precioUnitario.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]}.',
  )}';
  bool get disponible => (estado ?? true) && stockActual > 0;
}