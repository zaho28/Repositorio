import 'package:flutter/material.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../data/models/usuario_model.dart';

class GestionUsuariosScreen extends StatelessWidget {
  final UsuarioModel usuario;
  const GestionUsuariosScreen({super.key, required this.usuario});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'GestionUsuarios'),
      backgroundColor: AppColors.fondo,
      body: const Center(child: Text('Próximamente...', style: TextStyle(color: AppColors.texto))),
    );
  }
}