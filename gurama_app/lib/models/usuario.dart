class Usuario {

  final int idUsuario;
  final String nombre;
  final String correo;
  final String telefono;
  final String documento;
  final String contrasena;
  final String rol;
  final int codigo;

  Usuario({
    required this.idUsuario,
    required this.nombre,
    required this.correo,
    required this.telefono,
    required this.documento,
    required this.contrasena,
    required this.rol,
    required this.codigo,
  });

  factory Usuario.fromJson(
    Map<String, dynamic> json,
  ) {

    return Usuario(
      idUsuario: json['id_usuario'] ?? 0,

      nombre: json['nombre'] ?? '',

      correo: json['correo'] ?? '',

      telefono: json['telefono'] ?? '',

      documento: json['documento'] ?? '',

      contrasena: json['contrasena'] ?? '',

      rol: json['rol'] ?? 'cliente',

      codigo: json['codigo'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {

    return {

      'id_usuario': idUsuario,

      'nombre': nombre,

      'correo': correo,

      'telefono': telefono,

      'documento': documento,

      'contrasena': contrasena,

      'rol': rol,

      'codigo': codigo,
    };
  }
}