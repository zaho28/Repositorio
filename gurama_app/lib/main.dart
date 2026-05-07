import 'package:flutter/material.dart';

import 'screens/home_page.dart';
import 'screens/login_page.dart';
import 'screens/register_page.dart';
import 'screens/cliente_page.dart';
import 'screens/admin_panel_page.dart';

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
      },
    );
  }
}