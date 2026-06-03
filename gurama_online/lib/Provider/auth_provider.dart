import 'package:flutter/material.dart';
import 'package:gurama_online/Data/Models/usuario_model.dart';

class AuthProvider extends ChangeNotifier {

  // Estado interno: usuario logueado y token
  UsuarioModel? _usuario;
  String?       _token;

  // Getters públicos — solo lectura desde fuera
  UsuarioModel? get usuario     => _usuario;
  String?       get token       => _token;
  bool          get estaLogueado => _usuario != null;

  // ── Guardar sesión tras login exitoso ─────────────────────────────────────
  // Llamar desde Login_Screen justo después de parsear AuthResponseModel
  void guardarSesion(UsuarioModel usuario, String token) {
    _usuario = usuario;
    _token   = token;
    notifyListeners();
  }

  // ── Cerrar sesión ─────────────────────────────────────────────────────────
  void cerrarSesion() {
    _usuario = null;
    _token   = null;
    notifyListeners();
  }
}