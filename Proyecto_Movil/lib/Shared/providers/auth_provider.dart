import 'package:flutter/material.dart';
import '../../Data/models/usuario_model.dart';
import '../constants/app_constants.dart';      
import '../services/secure_storage_service.dart';

class AuthProvider extends ChangeNotifier {
  String? _token;
  UsuarioModel? _usuario;

  String? get token => _token;
  UsuarioModel? get usuario => _usuario;
  bool get isLoggedIn => _token != null && _usuario != null;

  // Carga el token guardado al iniciar la app
  Future<void> loadTokenFromStorage() async {
    _token = await SecureStorageService.getToken();
    notifyListeners();
  }

  // Guarda en Secure Storage también
  Future<void> setToken(String token) async {
    _token = token;
    await SecureStorageService.saveToken(token);
    notifyListeners();
  }

  // Recibe el Map del JSON y lo convierte al modelo
  void setUsuario(Map<String, dynamic> json) {
    _usuario = UsuarioModel.fromJson(json);
    notifyListeners();
  }

   // borra del Secure Storage también
  Future<void> logout() async {
    _token = null;
    _usuario = null;
    await SecureStorageService.clearAll();
    notifyListeners();
  }

  Map<String, String> get postHeaders => {
    'Content-Type': 'application/json',
    'x-api-key': AppConstants.apiKey, 
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  Map<String, String> get getHeaders => {
    'x-api-key': AppConstants.apiKey, 
    if (_token != null) 'Authorization': 'Bearer $_token',
  };
}