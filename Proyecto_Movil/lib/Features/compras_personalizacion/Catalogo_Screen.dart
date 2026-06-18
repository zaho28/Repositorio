import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Data/models/producto_model.dart';
import '../../Shared/services/api_service.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/providers/carrito_provider.dart';
import 'dart:convert';
import 'DetalleProducto_Screen.dart';
import 'Carrito_Screen.dart';

class CatalogoScreen extends StatefulWidget { 
    const CatalogoScreen({super.key});

    @override
    State<CatalogoScreen> createState() => _CatalogoScreenState();
    }

    class _CatalogoScreenState extends State<CatalogoScreen> {
    List<ProductoModel> _productos = [];
    List<ProductoModel> _filtrados = [];
    bool _cargando = true;
    String? _error;
    final _busquedaCtrl = TextEditingController();

    // Key para abrir el Drawer programáticamente
    final _scaffoldKey = GlobalKey<ScaffoldState>();

    @override
    void initState() {
        super.initState();
        _cargarProductos();
    }

    @override
    void dispose() {
        _busquedaCtrl.dispose();
        super.dispose();
    }

    Future<void> _cargarProductos() async {
        setState(() {
        _cargando = true;
        _error = null;
        });
        try {
        final res = await ApiService.get(AppConstants.obtenerProductos);
        if (res.statusCode == 200) {
            final lista = jsonDecode(res.body) as List;
            final todos = lista
                .map((e) => ProductoModel.fromJson(e))
                .where((p) => p.disponible)
                .toList();
            setState(() {
            _productos = todos;
            _filtrados = todos;
            _cargando = false;
            });
        } else {
            setState(() {
            _error = 'Error al cargar los productos';
            _cargando = false;
            });
        }
        } catch (e) {
        setState(() {
            _error = 'Error de conexión';
            _cargando = false;
        });
        }
    }

    void _buscar(String termino) {
        setState(() {
        _filtrados = _productos
            .where((p) =>
                p.nomProducto.toLowerCase().contains(termino.toLowerCase()) ||
                (p.descripcion?.toLowerCase().contains(termino.toLowerCase()) ??
                    false))
            .toList();
        });
    }

    @override
    Widget build(BuildContext context) {
        final carrito = context.watch<CarritoProvider>();

        return Scaffold(
        key: _scaffoldKey,
        backgroundColor: AppColors.fondo,

        // ── Drawer lateral (igual que ClienteScreen)
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
                        child: Icon(Icons.person_rounded,
                            color: Colors.white, size: 28),
                        ),
                        SizedBox(width: 14),
                        Text(
                        'Catálogo',
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
                    Navigator.pop(context); // volver al home
                    },
                ),
                _DrawerOpcion(
                    icon: Icons.grid_view_rounded,
                    label: 'Catálogo',
                    onTap: () => Navigator.pop(context),
                ),
                _DrawerOpcion(
                    icon: Icons.shopping_bag_outlined,
                    label: 'Carrito',
                    badge: carrito.totalProductos > 0
                        ? '${carrito.totalProductos}'
                        : null,
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const CarritoScreen()));
                    },
                ),
                _DrawerOpcion(
                    icon: Icons.auto_fix_high,
                    label: 'Pedidos Personalizados',
                    onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/cliente/pedido-personalizado');
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
            title: const Text(
            'Catálogo',
            style: TextStyle(
                color: AppColors.secundario,
                fontWeight: FontWeight.bold,
                fontSize: 18),
            ),
            bottom: PreferredSize(
            preferredSize: const Size.fromHeight(1),
            child: Container(height: 1, color: AppColors.grisBorde),
            ),
            actions: [
            Stack(
                clipBehavior: Clip.none,
                children: [
                IconButton(
                    icon: const Icon(Icons.shopping_bag_outlined,
                        color: AppColors.secundario, size: 24),
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const CarritoScreen())),
                ),
                if (carrito.totalProductos > 0)
                    Positioned(
                    right: 6,
                    top: 6,
                    child: Container(
                        width: 16,
                        height: 16,
                        decoration: const BoxDecoration(
                            color: AppColors.primario, shape: BoxShape.circle),
                        child: Text(
                        '${carrito.totalProductos}',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold),
                        ),
                    ),
                    ),
                ],
            ),
            IconButton(
                icon: const Icon(Icons.refresh_rounded,
                    color: AppColors.secundario, size: 22),
                onPressed: _cargarProductos,
            ),
            const SizedBox(width: 4),
            ],
        ),

        body: Column(
            children: [
            // Buscador
            Padding(
                padding: const EdgeInsets.all(12),
                child: TextField(
                controller: _busquedaCtrl,
                onChanged: _buscar,
                style: const TextStyle(color: AppColors.texto, fontSize: 14),
                decoration: InputDecoration(
                    hintText: 'Buscar productos...',
                    hintStyle:
                        const TextStyle(color: AppColors.textoClaro, fontSize: 14),
                    prefixIcon: const Icon(Icons.search_rounded,
                        color: AppColors.primario),
                    filled: true,
                    fillColor: AppColors.blanco,
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide:
                            const BorderSide(color: AppColors.grisBorde)),
                    enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide:
                            const BorderSide(color: AppColors.grisBorde)),
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide:
                            const BorderSide(color: AppColors.primario, width: 2)),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                ),
                ),
            ),

            // Grid
            Expanded(
                child: _cargando
                    ? const Center(
                        child: CircularProgressIndicator(color: AppColors.primario))
                    : _error != null
                        ? Center(
                            child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                                const Icon(Icons.error_outline,
                                    color: AppColors.primario, size: 60),
                                const SizedBox(height: 10),
                                Text(_error!,
                                    style: const TextStyle(
                                        color: AppColors.textoSecundario)),
                                const SizedBox(height: 20),
                                ElevatedButton(
                                onPressed: _cargarProductos,
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.primario),
                                child: const Text('Reintentar',
                                    style: TextStyle(color: Colors.white)),
                                ),
                            ],
                            ),
                        )
                        : _filtrados.isEmpty
                            ? const Center(
                                child: Text('No hay productos disponibles',
                                    style: TextStyle(
                                        color: AppColors.textoSecundario,
                                        fontSize: 16)))
                            : Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 12),
                                child: GridView.builder(
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 12,
                                    mainAxisSpacing: 12,
                                    childAspectRatio: 0.75,
                                ),
                                itemCount: _filtrados.length,
                                itemBuilder: (context, index) => _TarjetaProducto(
                                    producto: _filtrados[index],
                                    onTap: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (_) => DetalleProductoScreen(
                                            producto: _filtrados[index]),
                                    ),
                                    ),
                                ),
                                ),
                            ),
            ),
            ],
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

    class _TarjetaProducto extends StatelessWidget {
    final ProductoModel producto;
    final VoidCallback onTap;
    const _TarjetaProducto({required this.producto, required this.onTap});

    @override
    Widget build(BuildContext context) {
        final imgUrl = producto.rutaImagen != null
            ? '${AppConstants.baseUrl}${producto.rutaImagen}'
            : null;

        return GestureDetector(
        onTap: onTap,
        child: Container(
            decoration: BoxDecoration(
            color: AppColors.fondoTarjeta,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
                BoxShadow(
                    color: AppColors.primario.withOpacity(0.08),
                    blurRadius: 10,
                    offset: const Offset(0, 4))
            ],
            ),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
                Expanded(
                child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                    color: AppColors.grisClaro,
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(16)),
                    ),
                    child: imgUrl != null
                        ? ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(16)),
                            child: Image.network(imgUrl,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => const Icon(
                                    Icons.image_not_supported_rounded,
                                    color: AppColors.textoClaro,
                                    size: 50)),
                        )
                        : const Center(
                            child: Icon(Icons.shopping_bag_outlined,
                                color: AppColors.textoClaro, size: 50)),
                ),
                ),
                Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                    Text(producto.nomProducto,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppColors.texto,
                            fontSize: 13),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(producto.precioFormateado,
                        style: const TextStyle(
                            color: AppColors.primario,
                            fontWeight: FontWeight.bold,
                            fontSize: 14)),
                    if (producto.color != null)
                        Text('Color: ${producto.color}',
                            style: const TextStyle(
                                color: AppColors.textoClaro, fontSize: 11)),
                    ],
                ),
                ),
            ],
            ),
        ),
        );
    }
}