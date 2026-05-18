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

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController correoController = TextEditingController();
  final TextEditingController contrasenaController = TextEditingController();

  Future<void> login(BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse(AppConstants.login),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AppConstants.apiKey,
        },
        body: jsonEncode({
          'correo': correoController.text,
          'contrasena': contrasenaController.text,
        }),
      );

      print('STATUS: ${response.statusCode}');
      print('BODY: ${response.body}');
      final data = jsonDecode(response.body);

      if (!context.mounted) return;

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (data['needs_code'] == true) {
          // Admin/trabajador - debe verificar código
          if (data['token'] != null) {
            context.read<AuthProvider>().setToken(data['token']);
            ApiService.setToken(data['token']);
          }
          context.read<AuthProvider>().setUsuario(data['user']);

          Navigator.pushNamed(
            context,
            '/admin-code',
            arguments: {
              'id_usuario': data['user']['id_usuario'].toString()
            },
          );
        } else {
          // Cliente - va directo
          context.read<AuthProvider>().setToken(data['token']);
          ApiService.setToken(data['token']);
          context.read<AuthProvider>().setUsuario(data['user']);

          // Navigator.pushReplacementNamed(context, '/cliente');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('¡Bienvenido a Gurama Online!'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(data['message'] ?? 'Correo o contraseña incorrectos'),
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
                    'Iniciar Sesión',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.secundario,
                    ),
                  ),
                  AppSpaces.verticalLarge,
                  CustomTextField(
                    label: 'Correo electrónico',
                    icon: Icons.email,
                    controller: correoController,
                  ),
                  AppSpaces.verticalMedium,
                  CustomTextField(
                    label: 'Contraseña',
                    icon: Icons.lock,
                    controller: contrasenaController,
                    isPassword: true,
                  ),
                  AppSpaces.verticalinter,
                  CustomButton(
                    text: 'INGRESAR',
                    onPressed: () => login(context),
                  ),
                  AppSpaces.verticalMedium,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('¿No tiene cuenta?'),
                      TextButton(
                        onPressed: () {
                          // Navigator.pushNamed(context, '/registro');
                        },
                        child: const Text(
                          'Registrarse',
                          style: TextStyle(
                            color: AppColors.primario,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      // Navigator.pushNamed(context, '/olvide_c');
                    },
                    child: const Text(
                      '¿Olvidó su contraseña?',
                      style: TextStyle(color: AppColors.primario),
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