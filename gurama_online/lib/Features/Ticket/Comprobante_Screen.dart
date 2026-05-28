import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Data/Models/ticket_model.dart';
import 'package:gurama_online/Data/Models/producto_model.dart';
import 'package:gurama_online/Provider/ticket_provider.dart';
import 'package:gurama_online/Provider/carrito_provider.dart';

class TicketScreen extends StatelessWidget {
  const TicketScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<TicketProvider>();
    final ticket   = provider.ticket;

    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      body: ticket == null
          ? const Center(
        child: Text('No hay ticket disponible',
            style: TextStyle(color: Color(0xFF5a3d54), fontSize: 16)),
      )
          : Column(
        children: [
          _Header(),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  _BannerExito(),
                  _CuerpoTicket(ticket: ticket),
                  _ZigZag(),
                  _Botones(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Header ──────────────────────────────────────────────────────────────────
class _Header extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFc45a77),
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 12,
        bottom: 14, left: 16, right: 16,
      ),
      child: Row(
        children: const [
          Icon(Icons.receipt_long_rounded, color: Colors.white, size: 24),
          SizedBox(width: 10),
          Text('Comprobante de Pedido',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// ─── Banner de éxito ─────────────────────────────────────────────────────────
class _BannerExito extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: const Color(0xFF7a235f),
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Column(
        children: [
          Container(
            width: 52, height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle_outline_rounded, color: Colors.white, size: 30),
          ),
          const SizedBox(height: 8),
          const Text('¡Pedido realizado con éxito!',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Tu pedido está siendo procesado',
              style: TextStyle(color: Color(0xFFd4a9c2), fontSize: 12)),
        ],
      ),
    );
  }
}

// ─── Cuerpo del ticket ───────────────────────────────────────────────────────
class _CuerpoTicket extends StatelessWidget {
  final TicketModel ticket;
  const _CuerpoTicket({required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(12, 12, 12, 0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
        border: Border.all(color: const Color(0xFFd4a9c2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _FilaNumeroFecha(ticket: ticket),
          _SeccionTitulo('Productos'),
          ...ticket.productos.map((p) => _FilaProducto(producto: p)),
          _Totales(ticket: ticket),
          _SeccionTitulo('Datos del cliente'),
          _SeccionInfo(ticket: ticket),
          if (ticket.nota.isNotEmpty) _FilaNota(nota: ticket.nota),
        ],
      ),
    );
  }
}

// ─── Número de ticket y fecha ────────────────────────────────────────────────
class _FilaNumeroFecha extends StatelessWidget {
  final TicketModel ticket;
  const _FilaNumeroFecha({required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFd4a9c2), width: 1.5)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('TICKET', style: TextStyle(fontSize: 10, color: Color(0xFFb4788b), letterSpacing: 0.5)),
              const SizedBox(height: 2),
              Text(ticket.numTicket,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
              Text('Pedido #${ticket.idPedido}',
                  style: const TextStyle(fontSize: 11, color: Color(0xFFb4788b))),
            ],
          ),
          Text(ticket.fechaEmision,
              style: const TextStyle(fontSize: 12, color: Color(0xFF5a3d54), fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

// ─── Título de sección ────────────────────────────────────────────────────────
class _SeccionTitulo extends StatelessWidget {
  final String texto;
  const _SeccionTitulo(this.texto);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
      color: const Color(0xFFf3e4e9).withOpacity(0.6),
      child: Text(texto.toUpperCase(),
          style: const TextStyle(fontSize: 10, color: Color(0xFFb4788b),
              letterSpacing: 0.5, fontWeight: FontWeight.w600)),
    );
  }
}

// ─── Fila de producto ────────────────────────────────────────────────────────
class _FilaProducto extends StatelessWidget {
  final ProductoModel producto;
  const _FilaProducto({required this.producto});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFFDF0F4))),
      ),
      child: Row(
        children: [
          // Imagen del producto (igual que en CarritoScreen)
          Container(
            width: 40, height: 40,
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
                errorBuilder: (_, __, ___) =>
                const Icon(Icons.shopping_bag_outlined, color: Color(0xFFd4a9c2), size: 20),
              ),
            )
                : const Icon(Icons.shopping_bag_outlined, color: Color(0xFFd4a9c2), size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(producto.nomProducto,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF5a3d54))),
          ),
          Text(producto.precioFormateado,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
        ],
      ),
    );
  }
}

// ─── Totales ─────────────────────────────────────────────────────────────────
class _Totales extends StatelessWidget {
  final TicketModel ticket;
  const _Totales({required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      color: const Color(0xFFFDF8FB),
      child: Column(
        children: [
          _FilaTotal('Subtotal', ticket.subtotal, negrita: false),
          const SizedBox(height: 4),
          const Divider(color: Color(0xFFd4a9c2)),
          _FilaTotal('Total', ticket.total, negrita: true),
        ],
      ),
    );
  }
}

class _FilaTotal extends StatelessWidget {
  final String etiqueta;
  final double valor;
  final bool negrita;
  const _FilaTotal(this.etiqueta, this.valor, {required this.negrita});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(etiqueta, style: TextStyle(
          fontSize: negrita ? 16 : 13,
          fontWeight: negrita ? FontWeight.bold : FontWeight.w400,
          color: negrita ? const Color(0xFF7a235f) : const Color(0xFF5a3d54),
        )),
        Text(
          '\$${valor.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
          style: TextStyle(
            fontSize: negrita ? 16 : 13,
            fontWeight: negrita ? FontWeight.bold : FontWeight.w400,
            color: negrita ? const Color(0xFFc45a77) : const Color(0xFF5a3d54),
          ),
        ),
      ],
    );
  }
}

// ─── Datos del cliente ───────────────────────────────────────────────────────
class _SeccionInfo extends StatelessWidget {
  final TicketModel ticket;
  const _SeccionInfo({required this.ticket});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Column(
        children: [
          _FilaInfo(Icons.person_outline_rounded,  'Cliente',        ticket.cliente),
          _FilaInfo(Icons.email_outlined,          'Correo',         ticket.correo),
          _FilaInfo(Icons.phone_outlined,          'Teléfono',       ticket.telefono),
          _FilaInfo(Icons.credit_card_outlined,    'Método de pago', ticket.metodoPago),
          _FilaInfo(Icons.access_time_outlined,    'Estado',         ticket.estado,
              colorValor: const Color(0xFF7a235f)),
        ],
      ),
    );
  }
}

class _FilaInfo extends StatelessWidget {
  final IconData icono;
  final String etiqueta;
  final String valor;
  final Color? colorValor;
  const _FilaInfo(this.icono, this.etiqueta, this.valor, {this.colorValor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: Color(0xFFFDF0F4))),
      ),
      child: Row(
        children: [
          Icon(icono, color: const Color(0xFFc45a77), size: 18),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(etiqueta, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                Text(valor, style: TextStyle(
                  fontSize: 12, fontWeight: FontWeight.w500,
                  color: colorValor ?? const Color(0xFF5a3d54),
                )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Nota del pedido ─────────────────────────────────────────────────────────
class _FilaNota extends StatelessWidget {
  final String nota;
  const _FilaNota({required this.nota});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFf3e4e9),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFd4a9c2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.note_outlined, color: Color(0xFFc45a77), size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Nota del pedido', style: TextStyle(fontSize: 10, color: Colors.grey)),
                Text(nota, style: const TextStyle(fontSize: 12, color: Color(0xFF5a3d54))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Borde dentado (efecto ticket físico) ────────────────────────────────────
class _ZigZag extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12),
      child: CustomPaint(
        size: const Size(double.infinity, 12),
        painter: _ZigZagPainter(),
      ),
    );
  }
}

class _ZigZagPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final fill   = Paint()..color = const Color(0xFFf3e4e9)..style = PaintingStyle.fill;
    final border = Paint()..color = const Color(0xFFd4a9c2)..style = PaintingStyle.stroke..strokeWidth = 1;
    final path   = Path()..moveTo(0, 0);
    double x = 0; bool subir = true;
    while (x < size.width) {
      x += 12;
      path.lineTo(x, subir ? size.height : 0);
      subir = !subir;
    }
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    canvas.drawPath(path, fill);
    canvas.drawPath(path, border);
  }
  @override
  bool shouldRepaint(_) => false;
}

// ─── Botones de acción ────────────────────────────────────────────────────────
class _Botones extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // context.read → solo llama métodos, no se suscribe a cambios
    final ticketProvider  = context.read<TicketProvider>();
    final carritoProvider = context.read<CarritoProvider>();

    return Container(
      padding: const EdgeInsets.fromLTRB(12, 8, 12, 24),
      color: const Color(0xFFf3e4e9),
      child: Row(
        children: [
          // Botón compartir / copiar
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () async {
                await ticketProvider.copiarAlPortapapeles();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Text('Ticket copiado al portapapeles'),
                      backgroundColor: const Color(0xFF7a235f),
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  );
                }
                // ── Cuando tengas share_plus, reemplaza por: ───────────────
                // final texto = ticketProvider.generarTextoCompartir(); (hazlo público)
                // await Share.share(texto, subject: 'Mi pedido');
              },
              icon: const Icon(Icons.share_outlined, size: 18),
              label: const Text('Compartir'),
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFFc45a77),
                side: const BorderSide(color: Color(0xFFc45a77), width: 1.5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                padding: const EdgeInsets.symmetric(vertical: 13),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // Botón ir al inicio
          Expanded(
            flex: 2,
            child: ElevatedButton.icon(
              onPressed: () {
                // 1. Limpia el ticket del provider
                ticketProvider.limpiarTicket();
                // 2. Vacía el carrito (el pedido ya fue generado)
                carritoProvider.vaciar();
                // 3. Regresa al inicio eliminando todo el historial de navegación
                Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false);
              },
              icon: const Icon(Icons.home_outlined, size: 18),
              label: const Text('Ir al inicio',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFc45a77),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                padding: const EdgeInsets.symmetric(vertical: 13),
              ),
            ),
          ),
        ],
      ),
    );
  }
}