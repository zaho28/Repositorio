import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../services/api_service.dart';
import '../../Data/models/material_model.dart';

class MaterialProvider extends ChangeNotifier {
  List<MaterialModel> _materiales = [];
  bool _cargando = false;
  String? _error;

  List<MaterialModel> get materiales => _materiales;
  bool get cargando => _cargando;
  String? get error => _error;

  Future<void> cargarMateriales() async {
    try {
      _cargando = true;
      _error = null;
      notifyListeners();

      final res = await ApiService.get(AppConstants.obtenerMateriales);

      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _materiales = data.map((e) => MaterialModel.fromJson(e)).toList();
      } else {
        _error = 'Error al cargar materiales';
      }
    } catch (e) {
      _error = 'Error de conexión';
    } finally {
      _cargando = false;
      notifyListeners();
    }
  }

  Future<bool> crearMaterial(Map<String, dynamic> data, File? imagen) async {
    try {
      _cargando = true;
      notifyListeners();

      final res = await ApiService.post(AppConstants.crearMaterial, data);

      if (res.statusCode == 201) {
        final nuevoJson = jsonDecode(res.body);
        final nuevoMat = MaterialModel.fromJson(nuevoJson);
        
        if (imagen != null) {
          final urlImagen = '${AppConstants.subirImagenMaterial}/${nuevoMat.idMaterial}/imagen';
          await ApiService.postMultipart(urlImagen, imagen, fileField: 'imagen');
        }
        
        await cargarMateriales();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      _cargando = false;
      notifyListeners();
    }
  }

  Future<bool> actualizarMaterial(int id, Map<String, dynamic> data, File? imagen) async {
    try {
      _cargando = true;
      notifyListeners();

      final url = '${AppConstants.actualizarMaterial}/$id';
      final res = await ApiService.patch(url, data);

      if (res.statusCode == 200) {
        if (imagen != null) {
          final urlImagen = '${AppConstants.subirImagenMaterial}/$id/imagen';
          await ApiService.postMultipart(urlImagen, imagen, fileField: 'imagen');
        }
        await cargarMateriales();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      _cargando = false;
      notifyListeners();
    }
  }
}
