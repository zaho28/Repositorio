import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/widgets/Custom_Button.dart';
import '../../Shared/widgets/Custom_TextField.dart';
import '../../Shared/widgets/Custom_Sizedbox.dart';
import '../../Shared/constants/app_colors.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController correoController = TextEditingController();
  final TextEditingController contrasenaController = TextEditingController();

  // En clase (hotspot celular)
  //final String urlApi = 'http://10.143.84.248:3000/auth/login';
  // En casa (WiFi normal)
  final String urlApi = 'http://192.168.1.65:3000/auth/login';

  Future<void> login(BuildContext context) async {
    try {
      final response = await http.post(
        Uri.parse(urlApi),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'correo': correoController.text,
          'contrasena': contrasenaController.text,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('¡Bienvenido a Gurama Online!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Correo o contraseña incorrectos'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
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
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Iniciar Sesión',
                  style: TextStyle(
                    fontSize: 30,
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
                    const Text('¿No tienes cuenta?'),
                    TextButton(
                      onPressed: () {},
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}