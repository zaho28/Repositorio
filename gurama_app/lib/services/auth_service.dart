import 'dart:convert';

import 'package:flutter/services.dart';

import '../models/usuario.dart';

class AuthService {

  static Future<List<Usuario>> cargarUsuarios() async {

    final String response =
        await rootBundle.loadString(
      'assets/data/bd_emul.json',
    );

    final data = json.decode(response);

    return (data as List)
        .map((json) => Usuario.fromJson(json))
        .toList();
  }

  static Future<Usuario?> login(
    String correo,
    String contrasena,
  ) async {

    final usuarios = await cargarUsuarios();

    try {

      return usuarios.firstWhere(
        (u) =>
            u.correo == correo &&
            u.contrasena == contrasena,
      );

    } catch (e) {
      return null;
    }
  }
}