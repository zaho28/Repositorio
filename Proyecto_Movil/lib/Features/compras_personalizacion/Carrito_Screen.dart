import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Shared/providers/carrito_provider.dart';
import '../../Shared/providers/comprobante_provider.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Data/models/carrito_model.dart';
import '../../Shared/constants/app_constants.dart';
import 'Comprobante_Screen.dart';

class CarritoScreen extends StatelessWidget { 
    const CarritoScreen({super.key});

    // Key para abrir el Drawer
    static final _scaffoldKey = GlobalKey<ScaffoldState>();

    @override
    Widget build(BuildContext context) {
        return Consumer<CarritoProvider>(
        builder: (context, carrito, _) {
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
                    // Cabecera
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
                            child: Icon(Icons.shopping_bag_outlined,
                                color: Colors.white, size: 28),
                            ),
                            SizedBox(width: 14),
                            Text(
                            'Carrito',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold),
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
                        onTap: () => Navigator.pop(context),
                    ),
                    _DrawerOpcion(
                        icon: Icons.auto_fix_high,
                        label: 'Pedidos Personalizados',
                        onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(
                            context, '/cliente/pedido-personalizado');
                        },
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
                title: Text(
                'Carrito (${carrito.totalProductos})',
                style: const TextStyle(
                    color: AppColors.secundario,
                    fontWeight: FontWeight.bold,
                    fontSize: 18),
                ),
                bottom: PreferredSize(
                preferredSize: const Size.fromHeight(1),
                child: Container(height: 1, color: AppColors.grisBorde),
                ),
                actions: [
                if (carrito.items.isNotEmpty)
                    IconButton(
                    icon: const Icon(Icons.delete_outline,
                        color: AppColors.secundario),
                    onPressed: () => showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                        title: const Text('¿Vaciar carrito?'),
                        content: const Text(
                            'Se eliminarán todos los productos del carrito.'),
                        actions: [
                            TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar',
                                style:
                                    TextStyle(color: AppColors.textoSecundario)),
                            ),
                            TextButton(
                            onPressed: () {
                                carrito.vaciar();
                                Navigator.pop(context);
                            },
                            child: const Text('Vaciar',
                                style: TextStyle(color: AppColors.primario)),
                            ),
                        ],
                        ),
                    ),
                    ),
                const SizedBox(width: 4),
                ],
            ),

            body: carrito.items.isEmpty
                ? Center(
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                        const Icon(Icons.shopping_cart_outlined,
                            color: AppColors.grisClaro, size: 80),
                        const SizedBox(height: 15),
                        const Text('Tu carrito está vacío',
                            style: TextStyle(
                                fontSize: 18,
                                color: AppColors.secundario,
                                fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        const Text('Agrega productos desde el catálogo',
                            style:
                                TextStyle(color: AppColors.textoSecundario)),
                        const SizedBox(height: 25),
                        ElevatedButton(
                            onPressed: () => Navigator.pop(context),
                            style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primario,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20)),
                            ),
                            child: const Text('Ver catálogo',
                                style: TextStyle(color: Colors.white)),
                        ),
                        ],
                    ),
                    )
                : Column(
                    children: [
                        Expanded(
                        child: ListView.builder(
                            padding: const EdgeInsets.all(15),
                            itemCount: carrito.items.length,
                            itemBuilder: (_, index) => _ItemCarrito(
                                item: carrito.items[index], carrito: carrito),
                        ),
                        ),
                        _PanelTotal(carrito: carrito),
                    ],
                    ),
            );
        },
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
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
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

    class _PanelTotal extends StatelessWidget {
    final CarritoProvider carrito;
    const _PanelTotal({required this.carrito});

    Future<void> _generarTicket(
        BuildContext context, CarritoProvider carrito) async {
        final usuario = context.read<AuthProvider>().usuario;
        final token = context.read<AuthProvider>().token;

        if (usuario == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content:
                Text('Sesión expirada. Por favor inicia sesión de nuevo.'),
            backgroundColor: AppColors.primario));
        return;
        }

        showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => const Center(
            child: CircularProgressIndicator(color: AppColors.primario)),
        );

        final exito = await context.read<ComprobanteProvider>().crearTicket(
            items: carrito.items,
            usuario: usuario,
            metodoPago: 'Efectivo contra entrega',
            token: token ?? '',
            );

        if (context.mounted) Navigator.pop(context);

        if (exito) {
        carrito.vaciar();
        if (context.mounted) {
            Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const ComprobanteScreen()));
        }
        } else {
        final error = context.read<ComprobanteProvider>().error;
        if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(error ?? 'Error al procesar el pedido'),
                backgroundColor: AppColors.primario));
        }
        }
    }

    @override
    Widget build(BuildContext context) {
        return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
            color: AppColors.fondoTarjeta,
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(25)),
            boxShadow: [
            BoxShadow(
                color: AppColors.primario.withOpacity(0.10),
                blurRadius: 10)
            ],
        ),
        child: Column(
            children: [
            Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                const Text('Productos:',
                    style: TextStyle(color: AppColors.textoSecundario)),
                Text('${carrito.totalProductos}',
                    style:
                        const TextStyle(color: AppColors.textoSecundario)),
                ],
            ),
            const Divider(height: 20, color: AppColors.grisBorde),
            Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                const Text('Total:',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.secundario)),
                Text(carrito.totalFormateado,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primario)),
                ],
            ),
            const SizedBox(height: 15),
            SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                onPressed: () => _generarTicket(context, carrito),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primario,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15)),
                ),
                child: const Text('Generar Comprobante de Pedido',
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white)),
                ),
            ),
            ],
        ),
        );
    }
    }

    class _ItemCarrito extends StatelessWidget {
    final CarritoItemModel item;
    final CarritoProvider carrito;
    const _ItemCarrito({required this.item, required this.carrito});

    @override
    Widget build(BuildContext context) {
        final imgUrl = item.producto.rutaImagen != null
            ? '${AppConstants.baseUrl}${item.producto.rutaImagen}'
            : null;

        return Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
            color: AppColors.fondoTarjeta,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
            BoxShadow(
                color: AppColors.primario.withOpacity(0.08),
                blurRadius: 8,
                offset: const Offset(0, 3))
            ],
        ),
        child: Row(
            children: [
            Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                    color: AppColors.grisClaro,
                    borderRadius: BorderRadius.circular(12)),
                child: imgUrl != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(imgUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(
                                Icons.shopping_bag_outlined,
                                color: AppColors.textoClaro)),
                    )
                    : const Icon(Icons.shopping_bag_outlined,
                        color: AppColors.textoClaro),
            ),
            const SizedBox(width: 12),
            Expanded(
                child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                    Text(item.producto.nomProducto,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppColors.secundario,
                            fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(item.producto.precioFormateado,
                        style: const TextStyle(
                            color: AppColors.primario,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('Subtotal: ${item.subtotalFormateado}',
                        style: const TextStyle(
                            color: AppColors.textoClaro, fontSize: 12)),
                ],
                ),
            ),
            Column(
                children: [
                GestureDetector(
                    onTap: () =>
                        carrito.eliminar(item.producto.idProducto),
                    child: const Icon(Icons.delete_outline,
                        color: AppColors.primario, size: 20),
                ),
                const SizedBox(height: 8),
                Row(
                    children: [
                    _BtnCantidad(
                        icono: Icons.remove,
                        onTap: () => carrito
                            .disminuirCantidad(item.producto.idProducto)),
                    Padding(
                        padding:
                            const EdgeInsets.symmetric(horizontal: 8),
                        child: Text('${item.cantidad}',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: AppColors.secundario)),
                    ),
                    _BtnCantidad(
                        icono: Icons.add,
                        onTap: () => carrito
                            .aumentarCantidad(item.producto.idProducto)),
                    ],
                ),
                ],
            ),
            ],
        ),
        );
    }
    }

    class _BtnCantidad extends StatelessWidget {
    final IconData icono;
    final VoidCallback onTap;
    const _BtnCantidad({required this.icono, required this.onTap});

    @override
    Widget build(BuildContext context) {
        return GestureDetector(
        onTap: onTap,
        child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
                color: AppColors.primario,
                borderRadius: BorderRadius.circular(8)),
            child: Icon(icono, color: Colors.white, size: 16),
        ),
        );
    }
}