import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Shared/services/api_service.dart';
import '../../data/models/usuario_model.dart';

class PanelControlScreen extends StatelessWidget {
  final UsuarioModel usuario;

  const PanelControlScreen({super.key, required this.usuario});

  void _navegar(BuildContext context, String ruta) {
    Navigator.pop(context); // cierra el drawer
    Navigator.pushNamed(context, ruta, arguments: usuario);
  }

  void _logout(BuildContext context) {
    context.read<AuthProvider>().logout();
    ApiService.clearToken();
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Panel de Control'),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            // Header del drawer con datos del usuario
            DrawerHeader(
              decoration: const BoxDecoration(color: AppColors.primario),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: AppColors.blanco,
                    backgroundImage: usuario.imgPerfil != null
                        ? NetworkImage('${AppConstants.baseUrl}/${usuario.imgPerfil}')
                        : null,
                    child: usuario.imgPerfil == null
                        ? const Icon(Icons.person, color: AppColors.primario, size: 35)
                        : null,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    usuario.nombreCompleto,
                    style: const TextStyle(
                      color: AppColors.blanco,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    usuario.correo,
                    style: const TextStyle(color: AppColors.blanco, fontSize: 12),
                  ),
                ],
              ),
            ),

            _MenuItem(
              icon: Icons.dashboard,
              title: 'Panel de control',
              onTap: () => Navigator.pop(context),
            ),
            _MenuItem(
              icon: Icons.inventory,
              title: 'Productos',
              onTap: () => _navegar(context, '/admin/productos'),
            ),
            _MenuItem(
              icon: Icons.category,
              title: 'Materiales',
              onTap: () => _navegar(context, '/admin/materiales'),
            ),
            _MenuItem(
              icon: Icons.swap_horiz,
              title: 'Movimientos',
              onTap: () => _navegar(context, '/admin/movimientos'),
            ),
            _MenuItem(
              icon: Icons.receipt_long,
              title: 'Pedidos realizados',
              onTap: () => _navegar(context, '/admin/pedidos'),
            ),
            _MenuItem(
              icon: Icons.bar_chart,
              title: 'Reportes',
              onTap: () => _navegar(context, '/admin/reportes'),
            ),
            _MenuItem(
              icon: Icons.history,
              title: 'Historial de ventas',
              onTap: () => _navegar(context, '/admin/historial'),
            ),
            _MenuItem(
              icon: Icons.notifications,
              title: 'Notificaciones',
              onTap: () => _navegar(context, '/admin/notificaciones'),
            ),

            // Solo admin (rol 1)
            if (usuario.isAdmin) ...[
              const Divider(),
              _MenuItem(
                icon: Icons.people,
                title: 'Gestión de usuarios',
                onTap: () => _navegar(context, '/admin/usuarios'),
              ),
            ],

            const Divider(),
            _MenuItem(
              icon: Icons.logout,
              title: 'Cerrar sesión',
              color: Colors.red,
              onTap: () => _logout(context),
            ),
          ],
        ),
      ),
      body: Container(
        color: AppColors.fondo,
        child: Column(
          children: [
            // Header superior
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              color: AppColors.primario,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    usuario.isAdmin ? 'Admin' : 'Trabajador',
                    style: const TextStyle(
                      color: AppColors.blanco,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '${usuario.nom1} ${usuario.ape1}',
                        style: const TextStyle(color: AppColors.blanco),
                      ),
                      const SizedBox(width: 8),
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: AppColors.blanco,
                        backgroundImage: usuario.imgPerfil != null
                            ? NetworkImage('${AppConstants.subirImagen}/${usuario.imgPerfil}')
                            : null,
                        child: usuario.imgPerfil == null
                            ? const Icon(Icons.person, color: AppColors.primario, size: 18)
                            : null,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Cards de acceso rápido
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Selecciona una opción',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.secundario,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        _OpcionCard(
                          titulo: 'Reportes',
                          icono: Icons.bar_chart,
                          onTap: () => Navigator.pushNamed(
                            context, '/admin/reportes', arguments: usuario,
                          ),
                        ),
                        const SizedBox(width: 12),
                        _OpcionCard(
                          titulo: 'Historial\nde ventas',
                          icono: Icons.history,
                          onTap: () => Navigator.pushNamed(
                            context, '/admin/historial', arguments: usuario,
                          ),
                        ),
                        const SizedBox(width: 12),
                        _OpcionCard(
                          titulo: 'Notifi-\ncaciones',
                          icono: Icons.notifications,
                          onTap: () => Navigator.pushNamed(
                            context, '/admin/notificaciones', arguments: usuario,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final Color? color;

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.primario;
    return ListTile(
      leading: Icon(icon, color: c),
      title: Text(title, style: TextStyle(color: color ?? AppColors.texto)),
      onTap: onTap,
    );
  }
}

class _OpcionCard extends StatelessWidget {
  final String titulo;
  final IconData icono;
  final VoidCallback onTap;

  const _OpcionCard({
    required this.titulo,
    required this.icono,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 100,
          decoration: BoxDecoration(
            color: AppColors.blanco,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withValues(alpha: 0.15),
                blurRadius: 8,
                spreadRadius: 1,
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icono, color: AppColors.primario, size: 28),
              const SizedBox(height: 6),
              Text(
                titulo,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.texto,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}