import 'package:flutter/material.dart';

import 'screens/home_page.dart';
import 'screens/login_page.dart';
import 'screens/register_page.dart';
import 'screens/cliente_page.dart';
import 'screens/admin_panel_page.dart';
import 'screens/admin_code_page.dart';
import 'models/usuario.dart';
import 'screens/recover_password_page.dart';
import 'screens/change_password_page.dart';

void main() {
  runApp(const GuramaApp());
}

class GuramaApp extends StatelessWidget {
  const GuramaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      title: 'Gurama',

      theme: ThemeData(
        fontFamily: 'Segoe UI',
      ),

      // Pantalla inicial
      initialRoute: '/',

      // Rutas de la app
      routes: {
        '/': (context) => const HomePage(),

        '/login': (context) => const LoginPage(),

        '/register': (context) => const RegisterPage(),

        '/cliente': (context) => const ClientePage(),

        '/admin-panel': (context) => const AdminPanelPage(),

        '/change-password': (context) =>
          const ChangePasswordPage(),

        '/recover-password': (context) =>
          const RecoverPasswordPage(),

        '/admin-code': (context) {
          final usuario = ModalRoute.of(context)!
            .settings
            .arguments as Usuario;
          
          return AdminCodePage(usuario: usuario);
        },
      },
    );
  }
}