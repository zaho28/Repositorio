import 'package:flutter/material.dart';

class AdminPanelPage extends StatelessWidget {
  const AdminPanelPage({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: const Text("Panel Admin"),
      ),

      body: const Center(
        child: Text(
          "Bienvenido Administrador",
          style: TextStyle(fontSize: 30),
        ),
      ),
    );
  }
}