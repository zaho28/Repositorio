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
        // Guardar token final (el del verify-code es el válido)
        context.read<AuthProvider>().setToken(data['token']);
        ApiService.setToken(data['token']);
        context.read<AuthProvider>().setUsuario(data['user']);

        // Navegar con modelo tipado
        Navigator.pushReplacementNamed(
          context,
          '/admin/panel',
          arguments: UsuarioModel.fromJson(data['user']),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? 'Código incorrecto'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error de conexión'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Gurama Online'),
      body: Container(
        color: AppColors.blanco,
        child: Center(
          child: SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 40),
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: AppColors.blanco,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.2),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('lib/Assest/Logo_GO.jpeg', height: 80),
                  AppSpaces.verticalLarge,
                  const Text(
                    'Verificación Admin',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.secundario,
                    ),
                  ),
                  AppSpaces.verticalMedium,
                  const Text(
                    'Está ingresando como administrador, para continuar ingrese su código',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.texto),
                  ),
                  AppSpaces.verticalLarge,
                  CustomTextField(
                    label: 'Código de administrador',
                    icon: Icons.lock,
                    controller: codigoController,
                    isPassword: true,
                  ),
                  AppSpaces.verticalinter,
                  CustomButton(
                    text: 'INGRESAR',
                    onPressed: () => verificarCodigo(context),
                  ),
                  AppSpaces.verticalMedium,
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text(
                      'Volver',
                      style: TextStyle(
                        color: AppColors.primario,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}