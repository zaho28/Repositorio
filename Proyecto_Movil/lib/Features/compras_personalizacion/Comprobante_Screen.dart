import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Shared/providers/comprobante_provider.dart';
import '../../Shared/providers/carrito_provider.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Data/models/producto_model.dart';
import '../../Shared/constants/app_constants.dart';

class ComprobanteScreen extends StatelessWidget {
    const ComprobanteScreen({super.key});

    String _fmt(double precio) =>
        '\$${precio.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';

    @override
    Widget build(BuildContext context) {
        final ticket = context.watch<ComprobanteProvider>().ticket;

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
                    const Icon(Icons.check_circle,
                        color: Color(0xFFb4788b), size: 80),
                    const SizedBox(height: 10),
                    const Text('¡Pedido realizado con éxito!',
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
                                        color: Color(0xFFb4788b))),
                                ),
                            ],
                            ),
                            const Divider(height: 25, color: Color(0xFFd4a9c2)),
                            const Text('Cliente',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFb4788b))),
                            const SizedBox(height: 8),
                            _Fila('Nombre', ticket.cliente),
                            _Fila('Correo', ticket.correo),
                            _Fila('Teléfono', ticket.telefono),
                            _Fila('Método de pago', ticket.metodoPago),
                            const Divider(height: 25, color: Color(0xFFd4a9c2)),
                            const Text('Detalles del pedido',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFb4788b))),
                            const SizedBox(height: 8),
                            _Fila('Pedido', '# ${ticket.idPedido}'),
                            _Fila('Fecha', ticket.fechaEmision),
                            _Fila('Estado', ticket.estado),
                            const Divider(height: 25, color: Color(0xFFd4a9c2)),
                            const Text('Productos',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFb4788b))),
                            const SizedBox(height: 8),
                            ...ticket.productos.map((p) => _FilaProducto(p)),
                            const Divider(height: 25, color: Color(0xFFd4a9c2)),
                            _FilaTotal('Subtotal', ticket.subtotal, negrita: false),
                            const SizedBox(height: 6),
                            _FilaTotal('Total', ticket.total, negrita: true),
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
                            ],
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
                    const SizedBox(height: 20),

                    // Botones
                    Row(
                        children: [
                        Expanded(
                            child: OutlinedButton.icon(
                            onPressed: () async {
                                await context
                                    .read<ComprobanteProvider>()
                                    .copiarAlPortapapeles();
                                if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                    content:
                                        const Text('Ticket copiado al portapapeles'),
                                    backgroundColor: const Color(0xFFb4788b),
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
                        Expanded(
                            flex: 2,
                            child: ElevatedButton.icon(
                            onPressed: () {
                                context.read<ComprobanteProvider>().limpiarTicket();
                                context.read<CarritoProvider>().vaciar();
                                Navigator.pushNamedAndRemoveUntil(
                                    context, '/cliente', (route) => false);
                            },
                            icon: const Icon(Icons.home_outlined, size: 18),
                            label: const Text('Volver al inicio',
                                style: TextStyle(
                                    fontSize: 15, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFc45a77),
                                foregroundColor: Colors.white,
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
    }

    class _Fila extends StatelessWidget {
    final String label;
    final String valor;
    const _Fila(this.label, this.valor);

    @override
    Widget build(BuildContext context) {
        return Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
            Text(label,
                style:
                    const TextStyle(color: Color(0xFF5a3d54), fontSize: 13)),
            Flexible(
                child: Text(valor,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFb4788b),
                        fontSize: 13),
                    textAlign: TextAlign.right),
            ),
            ],
        ),
        );
    }
    }

    class _FilaProducto extends StatelessWidget {
    final ProductoModel producto;
    const _FilaProducto(this.producto);

    @override
    Widget build(BuildContext context) {
        final imgUrl = producto.rutaImagen != null
            ? '${AppConstants.baseUrl}${producto.rutaImagen}'
            : null;

        return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
            children: [
            Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                    color: const Color(0xFFf3e4e9),
                    borderRadius: BorderRadius.circular(8)),
                child: imgUrl != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(imgUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => const Icon(
                                Icons.shopping_bag_outlined,
                                color: Color(0xFFd4a9c2),
                                size: 20)),
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
                    color: Color(0xFFb4788b))),
            ],
        ),
        );
    }
    }

    class _FilaTotal extends StatelessWidget {
    final String label;
    final double valor;
    final bool negrita;
    const _FilaTotal(this.label, this.valor, {required this.negrita});

    @override
    Widget build(BuildContext context) {
        final precio =
            '\$${valor.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';
        return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
            Text(label,
                style: TextStyle(
                    fontSize: negrita ? 16 : 13,
                    fontWeight:
                        negrita ? FontWeight.bold : FontWeight.normal,
                    color: negrita
                        ? const Color(0xFFb4788b)
                        : const Color(0xFF5a3d54))),
            Text(precio,
                style: TextStyle(
                    fontSize: negrita ? 18 : 13,
                    fontWeight:
                        negrita ? FontWeight.bold : FontWeight.normal,
                    color: negrita
                        ? const Color(0xFFc45a77)
                        : const Color(0xFF5a3d54))),
        ],
        );
    }
}