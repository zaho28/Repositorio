import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/providers/carrito_provider.dart';
import 'Personalizacion_Sabanas_Screen.dart';
import 'Personalizacion_Cubrelechos_Screen.dart';

class PedidosPersonalizadosScreen extends StatelessWidget {
    const PedidosPersonalizadosScreen({super.key});

    static final _scaffoldKey = GlobalKey<ScaffoldState>();

    @override
    Widget build(BuildContext context) {
        final carrito = context.watch<CarritoProvider>();

        return Scaffold(
        key: _scaffoldKey,
        backgroundColor: AppColors.fondo,

        // ── Drawer lateral
        drawer: Drawer(
            width: MediaQuery.of(context).size.width * 0.78,
            backgroundColor: AppColors.fondoTarjeta,
            child: SafeArea(
            child: Column(
                children: [
                Container(
                    width: double.infinity,
                    padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
                    decoration: const BoxDecoration(
                    gradient: LinearGradient(
                        colors: [Color(0xFFb4788b), Color(0xFF9B497D)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                    ),
                    ),
                    child: const Row(
                    children: [
                        CircleAvatar(
                        radius: 28,
                        backgroundColor: Color(0x33FFFFFF),
                        child: Icon(Icons.auto_fix_high,
                            color: Colors.white, size: 28),
                        ),
                        SizedBox(width: 14),
                        Expanded(
                        child: Text(
                            'Pedidos Personalizados',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold),
                        ),
                        ),
                    ],
                    ),
                ),
                const SizedBox(height: 8),
                _DrawerOpcion(
                    icon: Icons.home_rounded,
                    label: 'Inicio',
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                    },
                ),
                _DrawerOpcion(
                    icon: Icons.grid_view_rounded,
                    label: 'Catálogo',
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/cliente/catalogo');
                    },
                ),
                _DrawerOpcion(
                    icon: Icons.shopping_bag_outlined,
                    label: 'Carrito',
                    badge: carrito.totalProductos > 0
                        ? '${carrito.totalProductos}'
                        : null,
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/cliente/carrito');
                    },
                ),
                _DrawerOpcion(
                    icon: Icons.auto_fix_high,
                    label: 'Pedidos Personalizados',
                    onTap: () => Navigator.pop(context),
                ),
                const Divider(height: 32),
                _DrawerOpcion(
                    icon: Icons.logout_rounded,
                    label: 'Salir',
                    color: Colors.red.shade400,
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamedAndRemoveUntil(
                        context, '/landing', (r) => false);
                    },
                ),
                ],
            ),
            ),
        ),

        appBar: AppBar(
            backgroundColor: AppColors.blanco,
            elevation: 0,
            scrolledUnderElevation: 0,
            automaticallyImplyLeading: false,
            centerTitle: true,
            leading: IconButton(
            icon: const Icon(Icons.menu_rounded,
                color: AppColors.secundario, size: 26),
            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
            tooltip: 'Menú',
            ),
            title: const Text(
            'Pedidos Personalizados',
            style: TextStyle(
                color: AppColors.secundario,
                fontWeight: FontWeight.bold,
                fontSize: 18),
            ),
            bottom: PreferredSize(
            preferredSize: const Size.fromHeight(1),
            child: Container(height: 1, color: AppColors.grisBorde),
            ),
        ),

        body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
                // Banner informativo
                Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                    gradient: AppColors.gradientePrimario,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                    BoxShadow(
                        color: AppColors.primario.withOpacity(0.25),
                        blurRadius: 12,
                        offset: const Offset(0, 4))
                    ],
                ),
                child: const Row(
                    children: [
                    Icon(Icons.auto_fix_high, color: Colors.white, size: 28),
                    SizedBox(width: 12),
                    Expanded(
                        child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            Text('Personaliza tu pedido',
                                style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold)),
                            SizedBox(height: 6),
                            Text(
                            'Elige el tipo de producto, tamaño, tela y color. Todo hecho a tu medida.',
                            style:
                                TextStyle(color: Color(0xFFf3e4e9), fontSize: 13),
                            ),
                        ],
                        ),
                    ),
                    ],
                ),
                ),
                const SizedBox(height: 30),
                const Text('¿Qué deseas personalizar?',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.secundario)),
                const SizedBox(height: 20),

                // Tarjeta Sábanas
                _tarjetaProducto(
                context: context,
                titulo: 'Sábanas',
                descripcion:
                    'Personaliza tu sábana con la tela, color, tamaño y extras que prefieras.',
                icono: Icons.king_bed_outlined,
                color: AppColors.primario,
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) => const PersonalizacionSabanasScreen())),
                ),
                const SizedBox(height: 15),

                // Tarjeta Cubrelechos
                _tarjetaProducto(
                context: context,
                titulo: 'Cubrelechos',
                descripcion:
                    'Diseña tu cubrelecho con dos telas, colores y diseños diferentes.',
                icono: Icons.layers_outlined,
                color: AppColors.secundario,
                onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (_) =>
                            const PersonalizacionCubrelechosScreen())),
                ),
                const SizedBox(height: 25),

                // Nota informativa
                Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                    color: AppColors.fondoTarjeta,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: AppColors.grisBorde),
                ),
                child: const Row(
                    children: [
                    Icon(Icons.info_outline, color: AppColors.primario),
                    SizedBox(width: 10),
                    Expanded(
                        child: Text(
                        'El pago se realiza contra entrega. Recibirás un ticket con los detalles de tu pedido.',
                        style: TextStyle(
                            color: AppColors.textoSecundario, fontSize: 13),
                        ),
                    ),
                    ],
                ),
                ),
            ],
            ),
        ),
        );
    }

    Widget _tarjetaProducto({
        required BuildContext context,
        required String titulo,
        required String descripcion,
        required IconData icono,
        required Color color,
        required VoidCallback onTap,
    }) {
        return GestureDetector(
        onTap: onTap,
        child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
            color: AppColors.fondoTarjeta,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
                BoxShadow(
                    color: color.withOpacity(0.10),
                    blurRadius: 10,
                    offset: const Offset(0, 4))
            ],
            ),
            child: Row(
            children: [
                Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                    color: color.withOpacity(0.10),
                    borderRadius: BorderRadius.circular(15)),
                child: Center(child: Icon(icono, color: color, size: 35)),
                ),
                const SizedBox(width: 15),
                Expanded(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                    Text(titulo,
                        style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: color)),
                    const SizedBox(height: 5),
                    Text(descripcion,
                        style: const TextStyle(
                            color: AppColors.textoSecundario, fontSize: 13)),
                    ],
                ),
                ),
                Icon(Icons.arrow_forward_ios_rounded, color: color, size: 18),
            ],
            ),
        ),
        );
    }
    }

    // ── Opción reutilizable para el Drawer
    class _DrawerOpcion extends StatelessWidget {
    final IconData icon;
    final String label;
    final String? badge;
    final Color? color;
    final VoidCallback onTap;

    const _DrawerOpcion({
        required this.icon,
        required this.label,
        required this.onTap,
        this.badge,
        this.color,
    });

    @override
    Widget build(BuildContext context) {
        final c = color ?? AppColors.secundario;
        return ListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
        leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
            color: c.withOpacity(0.10),
            borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: c, size: 20),
        ),
        title: Text(label,
            style: TextStyle(
                color: c, fontSize: 15, fontWeight: FontWeight.w500)),
        trailing: badge != null
            ? Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                    color: AppColors.primario,
                    borderRadius: BorderRadius.circular(20),
                ),
                child: Text(badge!,
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold)),
                )
            : Icon(Icons.chevron_right_rounded,
                color: c.withOpacity(0.4), size: 20),
        onTap: onTap,
        );
    }
}