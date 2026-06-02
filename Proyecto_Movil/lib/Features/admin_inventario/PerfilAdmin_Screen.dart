import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../Shared/providers/auth_provider.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/widgets/AdminSidebar.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/services/api_service.dart';
import '../../Data/models/usuario_model.dart';


class PerfilAdminScreen extends StatefulWidget {
  const PerfilAdminScreen({super.key});

  @override
  State<PerfilAdminScreen> createState() => _PerfilAdminScreenState();
}

class _PerfilAdminScreenState extends State<PerfilAdminScreen> {
  bool _cargando = true;
  bool _subiendoImagen = false;
  String? _errorMensaje;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  Future<void> _cargarDatos() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final idUsuario = auth.usuario?.idUsuario;

    if (idUsuario == null) {
      if (mounted) setState(() {
        _cargando = false;
        _errorMensaje = 'Usuario no encontrado en sesión.';
      });
      return;
    }

    try {
      final res = await ApiService.get('${AppConstants.obtenerUsuario}/$idUsuario');
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        // Actualizamos auth provider, esto notificará a los listeners
        auth.setUsuario(data);
        if (mounted) setState(() { _cargando = false; });
      } else {
        if (mounted) setState(() {
          _cargando = false;
          _errorMensaje = 'Error al cargar datos. Status: ${res.statusCode}';
        });
      }
    } catch (e) {
      if (mounted) setState(() {
        _cargando = false;
        _errorMensaje = 'Error de conexión: $e';
      });
    }
  }

  Future<void> _cambiarImagen() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);

    if (pickedFile == null) return;

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final idUsuario = auth.usuario?.idUsuario;
    if (idUsuario == null) return;

    setState(() => _subiendoImagen = true);

    try {
      final res = await ApiService.postMultipart(
        '${AppConstants.subirImagen}/$idUsuario/imagen',
        File(pickedFile.path),
        fileField: 'profileImage',
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        final dataStr = await res.stream.bytesToString();
        final data = jsonDecode(dataStr);
        
        // Actualizar la foto en el usuario actual del provider
        if (auth.usuario != null) {
          final usuarioJson = auth.usuario!.toJson();
          usuarioJson['img_perfil'] = data['img_perfil'];
          auth.setUsuario(usuarioJson);
        }
        
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Imagen actualizada exitosamente')));
      } else {
        final responseData = await res.stream.bytesToString();
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: ${res.statusCode} - $responseData'), backgroundColor: Colors.red));
      }
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error de conexión al subir imagen: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _subiendoImagen = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Escuchamos los cambios del usuario global
    final auth = Provider.of<AuthProvider>(context);
    final usuario = auth.usuario;

    return Scaffold(
      appBar: CustomAppBar(title: 'Perfil', showProfile: false), // Ocultamos en el header porque ya estamos en perfil
      drawer: usuario != null ? AdminSidebar(usuario: usuario) : null,
      backgroundColor: AppColors.fondo,
      body: _cargando && usuario == null
          ? Center(child: CircularProgressIndicator())
          : _errorMensaje != null && usuario == null
              ? Center(child: Text(_errorMensaje!, style: const TextStyle(color: Colors.red)))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      // Tarjeta de perfil
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.blanco,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [BoxShadow(color: Colors.grey.withValues(alpha: 0.1), blurRadius: 10)],
                        ),
                        child: Column(
                          children: [
                            // Foto
                            GestureDetector(
                              onTap: _subiendoImagen ? null : _cambiarImagen,
                              child: Stack(
                                children: [
                                  CircleAvatar(
                                    radius: 60,
                                    backgroundColor: Colors.grey.shade200,
                                    backgroundImage: usuario?.imgPerfil != null
                                        ? CachedNetworkImageProvider(AppConstants.getImageUrl(usuario!.imgPerfil), headers: ApiService.headers)
                                        : const AssetImage('lib/Assest/images/sin_foto_p.webp') as ImageProvider, // Optional fallback
                                    child: usuario?.imgPerfil == null ? const Icon(Icons.person, size: 60, color: Colors.grey) : null,
                                  ),
                                  if (_subiendoImagen)
                                    Positioned.fill(
                                      child: Container(
                                        decoration: const BoxDecoration(color: Colors.black45, shape: BoxShape.circle),
                                          child: Center(child: CircularProgressIndicator(color: Colors.white)),
                                      ),
                                    ),
                                  Positioned(
                                    bottom: 0,
                                    right: 0,
                                    child: Container(
                                      padding: const EdgeInsets.all(6),
                                      decoration: const BoxDecoration(color: AppColors.primario, shape: BoxShape.circle),
                                      child: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              usuario?.nombreRol ?? 'Usuario',
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primario),
                            ),
                            const SizedBox(height: 30),

                            // Info
                            _buildInfoItem('Nombre de usuario', usuario?.nombreCompleto ?? ''),
                            _buildInfoItem('Correo electrónico', usuario?.correo ?? ''),
                            _buildInfoItem('Número telefónico', usuario?.telefono ?? ''),
                            _buildInfoItem('Identificación', '${usuario?.tDoc ?? ''} ${usuario?.idUsuario ?? ''}'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Actions
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/cambiar-datos'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primario,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text('Cambiar datos', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/cambiar-contrasena'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primario,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Cambiar contraseña', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton(
                        onPressed: () {
                          auth.logout();
                          if (mounted) Navigator.pushReplacementNamed(context, '/login');
                        },
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 50),
                          side: const BorderSide(color: Colors.grey),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Cerrar sesión', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInfoItem(String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 4),
          Text(value.trim().isEmpty ? 'No disponible' : value, style: TextStyle(color: Colors.grey.shade700, fontSize: 16)),
        ],
      ),
    );
  }
}
