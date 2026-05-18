import 'package:flutter/material.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../data/models/usuario_model.dart';

class PedidosRealizadosScreen extends StatelessWidget {
  final UsuarioModel usuario;
  const PedidosRealizadosScreen({super.key, required this.usuario});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'PedidosRealizados'),
      backgroundColor: AppColors.fondo,
      body: const Center(child: Text('Próximamente...', style: TextStyle(color: AppColors.texto))),
    );
  }
}