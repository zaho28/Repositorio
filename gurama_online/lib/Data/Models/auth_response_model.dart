import 'package:gurama_online/Data/Models/usuario_model.dart';

class AuthResponseModel {
  final bool success;
  final UsuarioModel user;
  final String token;

  AuthResponseModel({
    required this.success,
    required this.user,
    required this.token,
  });

  factory AuthResponseModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseModel(
      success: json['success'],
      user: UsuarioModel.fromJson(json['user']),
      token: json['token'],
    );
  }
}