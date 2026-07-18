// Modelo que representa un material del backend
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
      idMaterial: json['id_material'],
      nombre: json['nombre'],
      tipo: json['tipo'],
      unidad: json['unidad'],
      precioUnitario: double.parse(json['precio_unitario'].toString()),
      stockActual: json['stock_actual'],
      rutaImagen: json['ruta_imagen'],
    );
  }

  String get precioFormateado => '\$${precioUnitario.toStringAsFixed(0).replaceAllMapped(
    RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]}.',
  )}/metro';
}

// Modelo para los colores de un material
class ColorMaterialModel {
  final int idColor;
  final String nombre;
  final String? codigoHex;

  ColorMaterialModel({
    required this.idColor,
    required this.nombre,
    this.codigoHex,
  });

  factory ColorMaterialModel.fromJson(Map<String, dynamic> json) {
    return ColorMaterialModel(
      idColor: json['id_color'],
      nombre: json['nombre'],
      codigoHex: json['codigo_hex'],
    );
  }
}

// Modelo para los diseños de un material
class DisenoMaterialModel {
  final int idDiseno;
  final String nombre;
  final String? rutaImagen;

  DisenoMaterialModel({
    required this.idDiseno,
    required this.nombre,
    this.rutaImagen,
  });

  factory DisenoMaterialModel.fromJson(Map<String, dynamic> json) {
    return DisenoMaterialModel(
      idDiseno: json['id_diseno'],
      nombre: json['nombre'],
      rutaImagen: json['ruta_imagen'],
    );
  }
}