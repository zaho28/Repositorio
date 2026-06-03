import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Provider/auth_provider.dart';
import 'package:gurama_online/Provider/comprobante_provider.dart';
import 'package:gurama_online/Provider/carrito_provider.dart';
import 'package:gurama_online/Features/Home/Home_Screen.dart';
import 'package:gurama_online/Data/Models/comprobante_model.dart';
import 'package:gurama_online/Data/Models/producto_model.dart';

class ComprobanteScreen extends StatelessWidget {
  const ComprobanteScreen({super.key});

  String _formatearPrecio(double precio) {
    return '\$${precio.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ComprobanteProvider>();
    final ticket = provider.ticket;

    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text('Comprobante de Pedido',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        automaticallyImplyLeading: false,
      ),
      body: ticket == null
          ? const Center(
          child: Text('No hay ticket disponible',
              style: TextStyle(color: Color(0xFF5a3d54), fontSize: 16)))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Icono de exito
            const Icon(Icons.check_circle, color: Color(0xFF7a235f), size: 80),
            const SizedBox(height: 10),
            const Text('Pedido realizado con exito!',
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7a235f))),
            const SizedBox(height: 5),
            const Text('El pago se realiza contra entrega.',
                style: TextStyle(color: Color(0xFF5a3d54)),
                textAlign: TextAlign.center),
            const SizedBox(height: 25),

            // Ticket
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 10)
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Encabezado
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('GuramaOnline',
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFc45a77),
                              fontStyle: FontStyle.italic)),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                            color: const Color(0xFFf3e4e9),
                            borderRadius: BorderRadius.circular(10)),
                        child: Text('# ${ticket.numTicket}',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF7a235f))),
                      ),
                    ],
                  ),
                  const Divider(height: 25, color: Color(0xFFd4a9c2)),

                  // Datos del cliente
                  const Text('Cliente',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF7a235f))),
                  const SizedBox(height: 8),
                  _fila('Nombre', ticket.cliente),
                  _fila('Correo', ticket.correo),
                  _fila('Telefono', ticket.telefono),
                  _fila('Metodo de pago', ticket.metodoPago),
                  const Divider(height: 25, color: Color(0xFFd4a9c2)),

                  // Detalles del pedido
                  const Text('Detalles del pedido',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF7a235f))),
                  const SizedBox(height: 8),
                  _fila('Pedido', '# ${ticket.idPedido}'),
                  _fila('Fecha', ticket.fechaEmision),
                  _fila('Estado', ticket.estado),
                  const Divider(height: 25, color: Color(0xFFd4a9c2)),

                  // Productos
                  const Text('Productos',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF7a235f))),
                  const SizedBox(height: 8),
                  ...ticket.productos.map((p) => _filaProducto(p)),
                  const Divider(height: 25, color: Color(0xFFd4a9c2)),

                  // Totales
                  _filaTotal('Subtotal', ticket.subtotal, negrita: false),
                  const SizedBox(height: 6),
                  _filaTotal('Total', ticket.total, negrita: true),
                  const SizedBox(height: 10),

                  if (ticket.nota.isNotEmpty) ...[
                    const Divider(height: 25, color: Color(0xFFd4a9c2)),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.note_outlined,
                            color: Color(0xFFc45a77), size: 18),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Nota del pedido',
                                  style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF5a3d54))),
                              Text(ticket.nota,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      color: Color(0xFF5a3d54))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                  ],

                  // Pago contra entrega
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                        color: const Color(0xFFf3e4e9),
                        borderRadius: BorderRadius.circular(10)),
                    child: const Row(
                      children: [
                        Icon(Icons.local_shipping_outlined,
                            color: Color(0xFFc45a77), size: 18),
                        SizedBox(width: 8),
                        Text('Pago contra entrega',
                            style: TextStyle(
                                color: Color(0xFF5a3d54),
                                fontSize: 12,
                                fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Botones
            Row(
              children: [
                // Boton compartir
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final comprobanteProvider =
                      context.read<ComprobanteProvider>();
                      await comprobanteProvider.copiarAlPortapapeles();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text(
                                'Ticket copiado al portapapeles'),
                            backgroundColor: const Color(0xFF7a235f),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8)),
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.share_outlined, size: 18),
                    label: const Text('Compartir'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFFc45a77),
                      side: const BorderSide(
                          color: Color(0xFFc45a77), width: 1.5),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 10),

                // Boton volver al inicio
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      context.read<ComprobanteProvider>().limpiarTicket();
                      context.read<CarritoProvider>().vaciar();
                      final usuario =
                      context.read<AuthProvider>().usuario!;
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                            builder: (_) =>
                                HomeScreen(usuario: usuario)),
                            (route) => false,
                      );
                    },
                    icon: const Icon(Icons.home_outlined, size: 18),
                    label: const Text('Volver al inicio',
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFc45a77),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _fila(String label, String valor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(color: Color(0xFF5a3d54), fontSize: 13)),
          Flexible(
            child: Text(valor,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7a235f),
                    fontSize: 13),
                textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }

  Widget _filaProducto(ProductoModel producto) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFf3e4e9),
              borderRadius: BorderRadius.circular(8),
            ),
            child: producto.rutaImagen != null
                ? ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                'http://192.168.20.94:3000${producto.rutaImagen}',
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(
                    Icons.shopping_bag_outlined,
                    color: Color(0xFFd4a9c2),
                    size: 20),
              ),
            )
                : const Icon(Icons.shopping_bag_outlined,
                color: Color(0xFFd4a9c2), size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(producto.nomProducto,
                style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF5a3d54))),
          ),
          Text(producto.precioFormateado,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF7a235f))),
        ],
      ),
    );
  }

  Widget _filaTotal(String label, double valor, {required bool negrita}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: TextStyle(
                fontSize: negrita ? 16 : 13,
                fontWeight:
                negrita ? FontWeight.bold : FontWeight.normal,
                color: negrita
                    ? const Color(0xFF7a235f)
                    : const Color(0xFF5a3d54))),
        Text(
          '\$${valor.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
          style: TextStyle(
              fontSize: negrita ? 18 : 13,
              fontWeight:
              negrita ? FontWeight.bold : FontWeight.normal,
              color: negrita
                  ? const Color(0xFFc45a77)
                  : const Color(0xFF5a3d54)),
        ),
      ],
    );
  }
}