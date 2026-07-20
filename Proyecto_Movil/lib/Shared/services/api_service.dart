import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';

class ApiService {
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static void clearToken() {
    _token = null;
  }

  static String? get currentToken => _token;

  static Map<String, String> get headers => {
    'x-api-key': AppConstants.apiKey,
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  static Map<String, String> get _postHeaders => {
    'x-api-key': AppConstants.apiKey,
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  // ── Para rutas públicas que usan "authorization" (ej: crear usuario)
  static Map<String, String> get _publicHeaders => {
    'Content-Type': 'application/json',
    'authorization': AppConstants.apiKey,
  };

  // ── GET
  static Future<http.Response> get(String url) async {
    final request = http.Request('GET', Uri.parse(url));
    headers.forEach((key, value) => request.headers[key] = value);
    final streamed = await request.send();
    return await http.Response.fromStream(streamed);
  }

  // ── POST autenticado (con token si existe)
  static Future<http.Response> post(String url, Map<String, dynamic> body) async {
    final request = http.Request('POST', Uri.parse(url));
    _postHeaders.forEach((key, value) => request.headers[key] = value);
    request.body = jsonEncode(body);
    final streamed = await request.send();
    return await http.Response.fromStream(streamed);
  }

  // ── POST público (sin token, usa "authorization" directo)
  static Future<http.Response> postPublic(String url, Map<String, dynamic> body) async {
    final request = http.Request('POST', Uri.parse(url));
    _publicHeaders.forEach((key, value) => request.headers[key] = value);
    request.body = jsonEncode(body);
    final streamed = await request.send();
    return await http.Response.fromStream(streamed);
  }

  // ── PATCH
  static Future<http.Response> patch(String url, Map<String, dynamic> body) async {
    final request = http.Request('PATCH', Uri.parse(url));
    _postHeaders.forEach((key, value) => request.headers[key] = value);
    request.body = jsonEncode(body);
    final streamed = await request.send();
    return await http.Response.fromStream(streamed);
  }

  // ── DELETE
  static Future<http.Response> delete(String url) async {
    final request = http.Request('DELETE', Uri.parse(url));
    headers.forEach((key, value) => request.headers[key] = value);
    final streamed = await request.send();
    return await http.Response.fromStream(streamed);
  }

  // ── POST multipart (subir imágenes)
  static Future<http.StreamedResponse> postMultipart(String url, File file, {String fileField = 'imagen_producto'}) async {
    final request = http.MultipartRequest('POST', Uri.parse(url));
    headers.forEach((key, value) => request.headers[key] = value);
    request.files.add(
      await http.MultipartFile.fromPath(fileField, file.path),
    );
    return await request.send();
  }
}