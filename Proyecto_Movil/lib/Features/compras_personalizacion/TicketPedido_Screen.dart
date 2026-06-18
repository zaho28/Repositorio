import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:proyecto_movil/Shared/providers/auth_provider.dart';

class TicketPedidoScreen extends StatelessWidget {
    final Map<String, dynamic> data;

    const TicketPedidoScreen({super.key, required this.data});

    String _formatearPrecio(num precio) {
        return '\$${precio.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
    }

    @override
    Widget build(BuildContext context) {
        final materiales = data['materiales'] as List<dynamic>? ?? [];

        return Scaffold(
        backgroundColor: const Color(0xFFf3e4e9),
        appBar: AppBar(
            title: const Text('Ticket de Pedido',
                style:
                    TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            centerTitle: true,
            backgroundColor: const Color(0xFFb4788b),
            automaticallyImplyLeading: false,
        ),
        body: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
            children: [
                const Icon(Icons.check_circle,
                    color: Color(0xFFb4788b), size: 80),
                const SizedBox(height: 10),
                const Text('¡Pedido creado exitosamente!',
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFb4788b))),
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
                            child: Text('# ${data['num_ticket']}',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFb4788b))),
                        ),
                        ],
                    ),
                    const Divider(height: 25, color: Color(0xFFd4a9c2)),

                    // Cliente
                    const Text('Cliente',
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFb4788b))),
                    const SizedBox(height: 8),
                    _fila('Nombre', data['usuario']?['nombre'] ?? ''),
                    _fila('ID', data['usuario']?['id_usuario'] ?? ''),
                    _fila('Correo', data['usuario']?['correo'] ?? ''),
                    _fila('Teléfono',
                        data['usuario']?['telefono']?.toString() ?? ''),
                    const Divider(height: 25, color: Color(0xFFd4a9c2)),

                    // Detalles
                    const Text('Detalles del pedido',
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFb4788b))),
                    const SizedBox(height: 8),
                    _fila('Producto', data['tipo_producto'] ?? ''),
                    _fila('Tamaño', data['tamanio'] ?? ''),
                    const Divider(height: 25, color: Color(0xFFd4a9c2)),

                    // Materiales
                    const Text('Materiales',
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFb4788b))),
                    const SizedBox(height: 8),
                    ...materiales.map((m) => Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                                Expanded(
                                    child: Text(
                                        '${m['nombre']} x${m['cantidad']} ${m['unidad']}',
                                        style: const TextStyle(
                                            color: Color(0xFF5a3d54),
                                            fontSize: 13))),
                                Text(
                                    _formatearPrecio(m['subtotal'] as num),
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF5a3d54))),
                            ],
                            ),
                        )),
                    const Divider(height: 25, color: Color(0xFFd4a9c2)),

                    // Total
                    Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                        const Text('Total',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFb4788b))),
                        Text(
                            _formatearPrecio(
                                data['precio_total'] as num),
                            style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFc45a77))),
                        ],
                    ),
                    const SizedBox(height: 10),
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
                const SizedBox(height: 25),

                // Botón volver al inicio
                SizedBox(
                width: double.infinity,
                height: 55,
                child: ElevatedButton(
                    onPressed: () {
                    Navigator.pushNamedAndRemoveUntil(
                        context, '/cliente', (route) => false);
                    },
                    style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFc45a77),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15)),
                    ),
                    child: const Text('Volver al inicio',
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white)),
                ),
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
                style: const TextStyle(
                    color: Color(0xFF5a3d54), fontSize: 13)),
            Flexible(
                child: Text(valor,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFb4788b),
                        fontSize: 13),
                    textAlign: TextAlign.right)),
            ],
        ),
        );
    }
}