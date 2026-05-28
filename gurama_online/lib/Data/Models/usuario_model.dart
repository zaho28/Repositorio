class UsuarioModel {
  final String idUsuario;
  final String nom1;
  final String? nom2;
  final String ape1;
  final String? ape2;
  final String correo;
  final String telefono;
  final String idRolUsuario;
  final String tDoc;
  final String? imgPerfil;
  final int estado;

  UsuarioModel({
    required this.idUsuario,
    required this.nom1,
    this.nom2,
    required this.ape1,
    this.ape2,
    required this.correo,
    required this.telefono,
    required this.idRolUsuario,
    required this.tDoc,
    this.imgPerfil,
    required this.estado,
  });

  factory UsuarioModel.fromJson(Map<String, dynamic> json) {
    return UsuarioModel(
      idUsuario: json['id_usuario'],
      nom1: json['nom_1'],
      nom2: json['nom_2'],
      ape1: json['ape_1'],
      ape2: json['ape_2'],
      correo: json['correo'],
      telefono: json['telefono'].toString(),
      idRolUsuario: json['id_rol_usuario'],
      tDoc: json['t_doc'],
      imgPerfil: json['img_perfil'],
      estado: json['estado'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_usuario': idUsuario,
      'nom_1': nom1,
      'nom_2': nom2,
      'ape_1': ape1,
      'ape_2': ape2,
      'correo': correo,
      'telefono': telefono,
      'id_rol_usuario': idRolUsuario,
      't_doc': tDoc,
      'img_perfil': imgPerfil,
      'estado': estado,
    };
  }

  // Lógica que antes estaba en la entity
  String get nombreCompleto => '${nom1} ${nom2 ?? ''} ${ape1} ${ape2 ?? ''}'.trim();
  bool get activo => estado == 1;
}