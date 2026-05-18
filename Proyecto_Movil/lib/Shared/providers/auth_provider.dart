import 'package:flutter/material.dart';
import '../../data/models/usuario_model.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  UsuarioModel? _usuario;

  String? get token => _token;
  UsuarioModel? get usuario => _usuario;
  bool get isLoggedIn => _token != null && _usuario != null;

  void setToken(String token) {
    _token = token;
    notifyListeners();
  }

  // Recibe el Map del JSON y lo convierte al modelo
  void setUsuario(Map<String, dynamic> json) {
    _usuario = UsuarioModel.fromJson(json);
    notifyListeners();
  }

  void logout() {
    _token = null;
    _usuario = null;
    notifyListeners();
  }

  Map<String, String> get postHeaders => {
    'Content-Type': 'application/json',
    'x-api-key': 'xyz123',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  Map<String, String> get getHeaders => {
    'x-api-key': 'xyz123',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };
}