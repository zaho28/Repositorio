import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Data/models/usuario_model.dart';

class PerfilScreen extends StatelessWidget {
    const PerfilScreen({super.key});

    @override
    Widget build(BuildContext context) {
        final usuario = context.watch<AuthProvider>().usuario;

        return Scaffold(
        backgroundColor: AppColors.fondo,
        body: usuario == null
            ? const Center(child: Text('No hay sesión activa'))
            : CustomScrollView(
                slivers: [
                    _buildSliverAppBar(context, usuario),
                    SliverToBoxAdapter(
                    child: Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
                        child: Column(
                        children: [
                            const SizedBox(height: 20),
                            _buildTarjetaDatos(usuario),
                            const SizedBox(height: 20),
                            _buildAcciones(context),
                        ],
                        ),
                    ),
                    ),
                ],
                ),
        );
    }

    // ── SliverAppBar con gradiente y avatar
    Widget _buildSliverAppBar(BuildContext context, UsuarioModel usuario) {
        return SliverAppBar(
        expandedHeight: 240,
        pinned: true,
        automaticallyImplyLeading: false,
        backgroundColor: AppColors.secundario,
        flexibleSpace: FlexibleSpaceBar(
            background: Stack(
            fit: StackFit.expand,
            children: [
                // Fondo con gradiente
                Container(
                decoration: const BoxDecoration(
                    gradient: LinearGradient(
                    colors: [Color(0xFF7A235F), Color(0xFFb4788b)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    ),
                ),
                ),
                // Círculos decorativos de fondo
                Positioned(
                top: -30,
                right: -30,
                child: Container(
                    width: 160,
                    height: 160,
                    decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withOpacity(0.06),
                    ),
                ),
                ),
                Positioned(
                bottom: -20,
                left: -20,
                child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withOpacity(0.06),
                    ),
                ),
                ),
                // Contenido: avatar + nombre + rol
                SafeArea(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                    const SizedBox(height: 8),
                    _buildAvatar(usuario),
                    const SizedBox(height: 12),
                    Text(
                        usuario.nombreCompleto,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.20),
                        borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                        usuario.nombreRol,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                        ),
                        ),
                    ),
                    ],
                ),
                ),
            ],
            ),
        ), 
        // Barra superior con logo y botón volver
        title: Row(
            children: [
            Image.asset(
                'lib/Assest/Logo_GO2.jpeg',
                height: 36,
                errorBuilder: (_, __, ___) => const Icon(
                Icons.storefront,
                size: 28,
                color: Colors.white,
                ),
            ),
            const Spacer(),
            TextButton.icon(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back_ios_rounded,
                    color: Colors.white, size: 16),
                label: const Text(
                'Volver',
                style: TextStyle(color: Colors.white, fontSize: 14),
                ),
            ),
            ],
        ),
        );
    }

    Widget _buildAvatar(UsuarioModel usuario) {
        final imgUrl = usuario.imgPerfil != null
            ? '${AppConstants.baseUrl}${usuario.imgPerfil}'
            : null;

        return Container(
        decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 3),
            boxShadow: [
            BoxShadow(
                color: Colors.black.withOpacity(0.20),
                blurRadius: 12,
                offset: const Offset(0, 4),
            ),
            ],
        ),
        child: CircleAvatar(
            radius: 46,
            backgroundColor: Colors.white.withOpacity(0.20),
            backgroundImage: imgUrl != null ? NetworkImage(imgUrl) : null,
            child: imgUrl == null
                ? Text(
                    usuario.nom1.isNotEmpty
                        ? usuario.nom1[0].toUpperCase()
                        : 'U',
                    style: const TextStyle(
                    fontSize: 38,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    ),
                )
                : null,
        ),
        );
    }

    // ── Tarjeta de datos personales
    Widget _buildTarjetaDatos(UsuarioModel usuario) {
        return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
            color: AppColors.fondoTarjeta,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
            BoxShadow(
                color: AppColors.primario.withOpacity(0.08),
                blurRadius: 12,
                offset: const Offset(0, 4),
            ),
            ],
        ),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
            // Encabezado de la tarjeta
            Row(
                children: [
                Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                    gradient: AppColors.gradientePrimario,
                    borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.person_rounded,
                        color: Colors.white, size: 18),
                ),
                const SizedBox(width: 10),
                const Text(
                    'Información personal',
                    style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.secundario,
                    ),
                ),
                ],
            ),
            const SizedBox(height: 16),
            Container(height: 1, color: AppColors.grisBorde),
            const SizedBox(height: 4),
            _FilaDato(
                icono: Icons.badge_outlined,
                label: 'Número de usuario',
                valor: '${usuario.tDoc ?? ''} ${usuario.idUsuario}',
            ),
            Container(height: 1, color: AppColors.grisBorde),
            _FilaDato(
                icono: Icons.email_outlined,
                label: 'Correo electrónico',
                valor: usuario.correo,
            ),
            Container(height: 1, color: AppColors.grisBorde),
            _FilaDato(
                icono: Icons.phone_outlined,
                label: 'Número telefónico',
                valor: usuario.telefono ?? 'No registrado',
            ),
            Container(height: 1, color: AppColors.grisBorde),
            _FilaDato(
                icono: Icons.fingerprint_rounded,
                label: 'Identificación',
                valor: usuario.idUsuario.toString(),
            ),
            ],
        ),
        );
    }

    // ── Botones de acción
    Widget _buildAcciones(BuildContext context) {
        return Column(
        children: [
            _BotonAccion(
            icono: Icons.edit_outlined,
            texto: 'Cambiar datos',
            onTap: () => Navigator.pushNamed(context, '/cambiar-datos'),
            ),
            const SizedBox(height: 12),
            _BotonAccion(
            icono: Icons.lock_outline_rounded,
            texto: 'Cambiar contraseña',
            onTap: () => Navigator.pushNamed(context, '/cambiar-contrasena'),
            ),
            const SizedBox(height: 12),
            _BotonAccionCerrar(
            onTap: () async {
                context.read<AuthProvider>().logout();
                Navigator.pushNamedAndRemoveUntil(
                    context, '/landing', (route) => false);
            },
            ),
        ],
        );
    }
    }

    // ── Fila de dato individual
    class _FilaDato extends StatelessWidget {
    final IconData icono;
    final String label;
    final String valor;

    const _FilaDato({
        required this.icono,
        required this.label,
        required this.valor,
    });

    @override
    Widget build(BuildContext context) {
        return Padding(
        padding: const EdgeInsets.symmetric(vertical: 14),
        child: Row(
            children: [
            Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                color: AppColors.primario.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icono, color: AppColors.primario, size: 18),
            ),
            const SizedBox(width: 14),
            Expanded(
                child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    Text(
                    label,
                    style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textoClaro,
                        fontWeight: FontWeight.w500,
                    ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                    valor,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.texto,
                    ),
                    ),
                ],
                ),
            ),
            ],
        ),
        );
    }
    }

    // ── Botón de acción estándar
    class _BotonAccion extends StatelessWidget {
    final IconData icono;
    final String texto;
    final VoidCallback onTap;

    const _BotonAccion({
        required this.icono,
        required this.texto,
        required this.onTap,
    });

    @override
    Widget build(BuildContext context) {
        return SizedBox(
        width: double.infinity,
        child: OutlinedButton(
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
            side: BorderSide(color: AppColors.primario.withOpacity(0.35)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
            backgroundColor: AppColors.fondoTarjeta,
            ),
            child: Row(
            children: [
                Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                    color: AppColors.primario.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icono, color: AppColors.primario, size: 18),
                ),
                const SizedBox(width: 14),
                Text(
                texto,
                style: const TextStyle(
                    color: AppColors.secundario,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                ),
                ),
                const Spacer(),
                Icon(Icons.chevron_right_rounded,
                    color: AppColors.primario.withOpacity(0.5), size: 20),
            ],
            ),
        ),
        );
    }
    }

    // ── Botón cerrar sesión con gradiente rojo
    class _BotonAccionCerrar extends StatelessWidget {
    final VoidCallback onTap;

    const _BotonAccionCerrar({required this.onTap});

    @override
    Widget build(BuildContext context) {
        return SizedBox(
        width: double.infinity,
        child: DecoratedBox(
            decoration: BoxDecoration(
            gradient: LinearGradient(
                colors: [Colors.red.shade400, Colors.red.shade600],
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
                BoxShadow(
                color: Colors.red.withOpacity(0.25),
                blurRadius: 10,
                offset: const Offset(0, 4),
                ),
            ],
            ),
            child: ElevatedButton(
            onPressed: onTap,
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
            ),
            child: Row(
                children: [
                Container(
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.logout_rounded,
                        color: Colors.white, size: 18),
                ),
                const SizedBox(width: 14),
                const Text(
                    'Cerrar sesión',
                    style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    ),
                ),
                const Spacer(),
                Icon(Icons.chevron_right_rounded,
                    color: Colors.white.withOpacity(0.6), size: 20),
                ],
            ),
            ),
        ),
        );
    }
}