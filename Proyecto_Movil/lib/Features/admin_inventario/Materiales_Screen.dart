import 'package:flutter/material.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../data/models/usuario_model.dart';

class MaterialesScreen extends StatelessWidget {
  final UsuarioModel usuario;
  const MaterialesScreen({super.key, required this.usuario});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Materiales'),
      backgroundColor: AppColors.fondo,
      body: const Center(child: Text('Próximamente...', style: TextStyle(color: AppColors.texto))),
    );
  }
}