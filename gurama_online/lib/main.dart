import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Features/Auth-login/Login-Screen.dart';
import 'package:gurama_online/Provider/carrito_provider.dart';
import 'package:gurama_online/Provider/comprobante_provider.dart';
import 'package:gurama_online/Provider/auth_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CarritoProvider()),
        ChangeNotifierProvider(create: (_) => ComprobanteProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'GuramaOnline',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFFC45A77),
      ),
      home: LoginScreen(),
    );
  }
}