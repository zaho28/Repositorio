import 'package:flutter/material.dart';
import 'package:gurama_online/Data/Models/producto_model.dart';
import 'package:gurama_online/Data/Models/usuario_model.dart';
import 'package:gurama_online/Features/Detalle_producto/DetalleProducto_Screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CatalogoScreen extends StatefulWidget {
  final UsuarioModel usuario;

  const CatalogoScreen({super.key, required this.usuario});

  @override
  State<CatalogoScreen> createState() => _CatalogoScreenState();
}

class _CatalogoScreenState extends State<CatalogoScreen> {
  // Lista de productos que se cargará del backend
  List<ProductoModel> productos = [];
  bool cargando = true;
  String? error;

  @override
  void initState() {
    super.initState();
    cargarProductos();
  }

  Future<void> cargarProductos() async {
    final String urlApi = 'http://192.168.20.94:3000/productos';

    try {
      final response = await http.get(Uri.parse(urlApi));

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);

        setState(() {
          // Convertimos cada item del JSON a ProductoModel directamente
          productos = jsonList
              .map((item) => ProductoModel.fromJson(item))
              .where((p) => p.disponible) // getter del ProductoModel
              .toList();
          cargando = false;
        });
      } else {
        setState(() {
          error = 'Error al cargar los productos';
          cargando = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error de conexión: $e';
        cargando = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text('Catálogo', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: () {
              setState(() => cargando = true);
              cargarProductos();
            },
          ),
        ],
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFc45a77)))
          : error != null
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Color(0xFFc45a77), size: 60),
            const SizedBox(height: 10),
            Text(error!, style: const TextStyle(color: Color(0xFF5a3d54))),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: cargarProductos,
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFc45a77)),
              child: const Text('Reintentar', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      )
          : productos.isEmpty
          ? const Center(child: Text('No hay productos disponibles', style: TextStyle(color: Color(0xFF5a3d54), fontSize: 16)))
          : Padding(
        padding: const EdgeInsets.all(15),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.75,
          ),
          itemCount: productos.length,
          itemBuilder: (context, index) {
            return _tarjetaProducto(productos[index], index);
          },
        ),
      ),
    );
  }

  Widget _tarjetaProducto(ProductoModel producto, int index) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetalleScreen(
              producto: productos[index],
              usuario: widget.usuario,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [BoxShadow(color: const Color(0xFFd4a9c2).withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 3))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Color(0xFFf3e4e9),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(15)),
                ),
                child: producto.rutaImagen != null
                    ? ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                  child: Image.network(
                    'http://192.168.20.94:3000${producto.rutaImagen}',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                    const Icon(Icons.image_not_supported, color: Color(0xFFd4a9c2), size: 50),
                  ),
                )
                    : const Center(child: Icon(Icons.shopping_bag_outlined, color: Color(0xFFd4a9c2), size: 50)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // nomProducto viene del ProductoModel directamente
                  Text(producto.nomProducto, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF7a235f), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 4),
                  // precioFormateado viene del getter del ProductoModel
                  Text(producto.precioFormateado, style: const TextStyle(color: Color(0xFFc45a77), fontWeight: FontWeight.bold, fontSize: 14)),
                  if (producto.color != null)
                    Text('Color: ${producto.color}', style: const TextStyle(color: Color(0xFF5a3d54), fontSize: 11)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}