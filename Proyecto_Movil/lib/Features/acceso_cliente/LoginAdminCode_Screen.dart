import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'dart:convert';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/widgets/Custom_Button.dart';
import '../../Shared/widgets/Custom_TextField.dart';
import '../../Shared/widgets/Custom_Sizedbox.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Shared/services/api_service.dart';
import '../../Data/models/usuario_model.dart';

class LoginAdminCodeScreen extends StatelessWidget {
  final String idUsuario;

  LoginAdminCodeScreen({super.key, required this.idUsuario});

  final TextEditingController codigoController = TextEditingController();

  Future<void> verificarCodigo(BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse(AppConstants.verifyCode),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AppConstants.apiKey,
        },
        body: jsonEncode({
          'id_usuario': idUsuario,
          'codigo': codigoController.text,
        }),
      );

      final data = jsonDecode(response.body);

      if (!context.mounted) return;

      if (response.statusCode == 200 || response.statusCode == 201) {
        context.read<AuthProvider>().setToken(data['token']);
        ApiService.setToken(data['token']);
        context.read<AuthProvider>().setUsuario(data['user']);
        Navigator.pushReplacementNamed(
          context,
          '/admin/panel',
          arguments: UsuarioModel.fromJson(data['user']),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? 'Código incorrecto'),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Error de conexión'),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.fondo,
      appBar: AppBar(
        backgroundColor: AppColors.blanco,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.primario, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Image.asset(
          'lib/Assest/Logo_GO.jpeg',
          height: 44,
          errorBuilder: (_, __, ___) => const Icon(
            Icons.storefront,
            size: 36,
            color: AppColors.primario,
          ),
        ),
        centerTitle: false,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            children: [
              // Ícono / encabezado
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  gradient: AppColors.gradientePrimario,
                  shape: BoxShape.circle,
                  boxShadow: AppColors.sombra,
                ),
                child: const Icon(
                  Icons.admin_panel_settings_rounded,
                  color: AppColors.blanco,
                  size: 38,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Verificación Admin',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: AppColors.secundario,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Ingresa el código de administrador\npara acceder al panel',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textoSecundario,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),

              // Tarjeta
              Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: AppColors.fondoTarjeta,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: AppColors.sombra,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Info banner
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.grisClaro,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.info_outline_rounded,
                              color: AppColors.primarioOscuro, size: 18),
                          SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Estás iniciando como administrador. Revisa tu correo para obtener el código.',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.texto,
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 22),

                    const Text(
                      'Código de administrador',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.texto,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: codigoController,
                      obscureText: true,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: AppColors.texto,
                        fontSize: 22,
                        letterSpacing: 8,
                        fontWeight: FontWeight.bold,
                      ),
                      decoration: InputDecoration(
                        hintText: '• • • • • •',
                        hintStyle: TextStyle(
                          color: AppColors.textoClaro,
                          fontSize: 20,
                          letterSpacing: 6,
                        ),
                        filled: true,
                        fillColor: AppColors.fondoInput,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: AppColors.grisBorde),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: AppColors.grisBorde),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: AppColors.primario, width: 2),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 18),
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Botón principal
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: AppColors.gradientePrimario,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primario.withOpacity(0.35),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: () => verificarCodigo(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text(
                          'Ingresar',
                          style: TextStyle(
                            color: AppColors.blanco,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Botón volver
                    OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        side: const BorderSide(color: AppColors.grisBorde, width: 1.5),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text(
                        'Volver',
                        style: TextStyle(
                          color: AppColors.textoSecundario,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}