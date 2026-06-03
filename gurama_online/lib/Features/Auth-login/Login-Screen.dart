import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Shared/Custom-Sizedbox.dart';
import 'package:gurama_online/Shared/Custom-TextField.dart';
import 'package:gurama_online/Shared/Custom-button.dart';
import 'package:gurama_online/Data/Models/auth_response_model.dart';
import 'package:gurama_online/Features/Home/Home_Screen.dart';
import 'package:gurama_online/Provider/auth_provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController emailController    = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> login(BuildContext context) async {
    final String urlApi = 'http://192.168.20.94:3000/auth/login';

    try {
      final response = await http.post(
        Uri.parse(urlApi),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'correo'    : emailController.text,
          'contrasena': passwordController.text,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final Map<String, dynamic> jsonData = jsonDecode(response.body);
        final AuthResponseModel authResponse = AuthResponseModel.fromJson(jsonData);

        print("¡Éxito! Bienvenido ${authResponse.user.nombreCompleto}");

        // ── CAMBIO CLAVE ──────────────────────────────────────────────────
        // Guarda el usuario en AuthProvider para que cualquier pantalla
        // pueda accederlo sin necesidad de pasarlo por parámetros
        if (context.mounted) {
          context.read<AuthProvider>().guardarSesion(
            authResponse.user,
            authResponse.token,
          );

          // Navega al home — ya no es necesario pasar el usuario como
          // parámetro porque cualquier pantalla lo lee del AuthProvider
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => HomeScreen(usuario: authResponse.user),
            ),
          );
        }

      } else {
        print("Error de credenciales: ${response.body}");
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('¡Correo o contraseña incorrectos!'),
              backgroundColor: Color(0xFFc45a77),
            ),
          );
        }
      }
    } catch (e) {
      print("Error de conexión: $e");
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('¡Error de conexión! Verifica tu red.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // El build no cambia nada visual, es exactamente igual que antes
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text(
          'GuramaOnline',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock_outline, size: 80, color: Color(0xFFc45a77)),
                AppSpaces.verticalMedium,
                const Text(
                  'Iniciar Sesión',
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Color(0xFF7a235f)),
                ),
                AppSpaces.verticalLarge,
                CustomTextField(
                  label: 'Correo electrónico',
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  controller: emailController,
                ),
                AppSpaces.verticalMedium,
                CustomTextField(
                  label: 'Contraseña',
                  icon: Icons.lock_outline,
                  isPassword: true,
                  controller: passwordController,
                ),
                AppSpaces.verticalinter,
                CustomButton(
                  text: 'INGRESAR',
                  onPressed: () => login(context),
                ),
                AppSpaces.verticalMedium,
                Column(
                  children: [
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        '¿Olvidaste tu contraseña?',
                        style: TextStyle(color: Color(0xFF7a235f), fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('¿No tienes cuenta?', style: TextStyle(color: Color(0xFF5a3d54), fontSize: 14)),
                        TextButton(
                          onPressed: () {},
                          child: const Text(
                            'Regístrate',
                            style: TextStyle(color: Color(0xFFc45a77), fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ),
                      ],
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