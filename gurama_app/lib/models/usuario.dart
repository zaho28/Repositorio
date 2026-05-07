class Usuario {

  final int id;
  final String nombre;
  final String correo;
  final String contrasena;
  final String rol;
  final String? codigo;

  Usuario({
    required this.id,
    required this.nombre,
    required this.correo,
    required this.contrasena,
    required this.rol,
    this.codigo,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {

    return Usuario(
      id: json['id'],
      nombre: json['nombre'],
      correo: json['correo'],
      contrasena: json['contrasena'],
      rol: json['rol'],
      codigo: json['codigo'],
    );
  }
}