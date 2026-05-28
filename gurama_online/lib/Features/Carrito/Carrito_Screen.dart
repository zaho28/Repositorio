import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Provider/carrito_provider.dart';
import 'package:gurama_online/Provider/ticket_provider.dart';
import 'package:gurama_online/Provider/auth_provider.dart';
import 'package:gurama_online/Data/Models/carrito_model.dart';
import 'package:gurama_online/Features/Ticket/Comprobante_Screen.dart';

class CarritoScreen extends StatelessWidget {
  const CarritoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CarritoProvider>(
      builder: (context, carrito, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFf3e4e9),
          appBar: AppBar(
            title: Text(
              'Carrito (${carrito.totalProductos})',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
            centerTitle: true,
            backgroundColor: const Color(0xFFb4788b),
            iconTheme: const IconThemeData(color: Colors.white),
            actions: [
              if (carrito.items.isNotEmpty)
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.white),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('¿Vaciar carrito?'),
                        content: const Text('Se eliminarán todos los productos del carrito.'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar', style: TextStyle(color: Color(0xFF5a3d54))),
                          ),
                          TextButton(
                            onPressed: () {
                              carrito.vaciar();
                              Navigator.pop(context);
                            },
                            child: const Text('Vaciar', style: TextStyle(color: Color(0xFFc45a77))),
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),

          body: carrito.items.isEmpty
              ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.shopping_cart_outlined, color: Color(0xFFd4a9c2), size: 80),
                const SizedBox(height: 15),
                const Text('Tu carrito está vacío',
                    style: TextStyle(fontSize: 18, color: Color(0xFF7a235f), fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text('Agrega productos desde el catálogo',
                    style: TextStyle(color: Color(0xFF5a3d54))),
                const SizedBox(height: 25),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFc45a77),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                  child: const Text('Ver catálogo', style: TextStyle(color: Colors.white)),
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
                  itemBuilder: (context, index) {
                    return _itemCarrito(context, carrito.items[index], carrito);
                  },
                ),
              ),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10)],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Productos:', style: TextStyle(color: Color(0xFF5a3d54))),
                        Text('${carrito.totalProductos}', style: const TextStyle(color: Color(0xFF5a3d54))),
                      ],
                    ),
                    const Divider(height: 20, color: Color(0xFFd4a9c2)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total:',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
                        Text(carrito.totalFormateado,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFc45a77))),
                      ],
                    ),
                    const SizedBox(height: 15),
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: () => _generarTicket(context, carrito),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFc45a77),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        ),
                        child: const Text('Generar Comprobante de Pedido',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _generarTicket(BuildContext context, CarritoProvider carrito) {
    // ── LEE EL USUARIO REAL DEL AuthProvider ─────────────────────────────
    // Ya no hay usuario de prueba. Si el usuario no está logueado
    // (cosa que no debería pasar), muestra un aviso y no hace nada.
    final usuario = context.read<AuthProvider>().usuario;

    if (usuario == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sesión expirada. Por favor inicia sesión de nuevo.'),
          backgroundColor: Color(0xFFc45a77),
        ),
      );
      return;
    }

    // 1. Crea el ticket con los datos reales del usuario logueado
    context.read<TicketProvider>().crearTicket(
      items      : carrito.items,
      usuario    : usuario,          // ← usuario real de la sesión
      metodoPago : 'Efectivo contra entrega',
      nota       : '',
    );

    // 2. Navega al ticket reemplazando el carrito en el stack
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const TicketScreen()),
    );
  }

  Widget _itemCarrito(BuildContext context, CarritoItemModel item, CarritoProvider carrito) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(color: const Color(0xFFd4a9c2).withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 3))
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(
              color: const Color(0xFFf3e4e9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: item.producto.rutaImagen != null
                ? ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                'http://192.168.20.94:3000${item.producto.rutaImagen}',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) =>
                const Icon(Icons.shopping_bag_outlined, color: Color(0xFFd4a9c2)),
              ),
            )
                : const Icon(Icons.shopping_bag_outlined, color: Color(0xFFd4a9c2)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.producto.nomProducto,
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF7a235f), fontSize: 14),
                    maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(item.producto.precioFormateado,
                    style: const TextStyle(color: Color(0xFFc45a77), fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text('Subtotal: ${item.subtotalFormateado}',
                    style: const TextStyle(color: Color(0xFF5a3d54), fontSize: 12)),
              ],
            ),
          ),
          Column(
            children: [
              GestureDetector(
                onTap: () => carrito.eliminar(item.producto.idProducto),
                child: const Icon(Icons.delete_outline, color: Color(0xFFc45a77), size: 20),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _botonCantidad(
                    icono: Icons.remove,
                    onTap: () => carrito.disminuirCantidad(item.producto.idProducto),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text('${item.cantidad}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF7a235f))),
                  ),
                  _botonCantidad(
                    icono: Icons.add,
                    onTap: () => carrito.aumentarCantidad(item.producto.idProducto),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _botonCantidad({required IconData icono, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: const Color(0xFFc45a77),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icono, color: Colors.white, size: 16),
      ),
    );
  }
}