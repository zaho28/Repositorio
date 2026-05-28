import 'package:flutter/material.dart';
import 'package:gurama_online/Features/Pedido_personalizado/Personalizacion_Cubrelechos_Screen.dart';
import 'package:gurama_online/Features/Pedido_personalizado/Personalizacion_Sabanas_Screen.dart';

class PedidoPersonalizadoScreen extends StatelessWidget {
  const PedidoPersonalizadoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text(
          'Pedido Personalizado',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            const Text(
              '¿Qué deseas personalizar?',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF7a235f),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Selecciona el tipo de producto que quieres pedir',
              style: TextStyle(fontSize: 14, color: Color(0xFF5a3d54)),
            ),
            const SizedBox(height: 36),

            // ── Tarjeta Cubre lecho ──────────────────────────────────────
            _TarjetaProducto(
              titulo      : 'Cubre Lecho',
              descripcion : 'Personaliza tu cubre lecho con el material, color y diseño de tu preferencia. Puedes elegir diferente tela para cada lado.',
              icono       : Icons.bed_outlined,
              onTap       : () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CubrelectoScreen()),
              ),
            ),
            const SizedBox(height: 20),

            // ── Tarjeta Sábana ───────────────────────────────────────────
            _TarjetaProducto(
              titulo      : 'Sábana',
              descripcion : 'Personaliza tu sábana con el material, color y extras que prefieras. Incluye opciones de fundas y sobresábana.',
              icono       : Icons.king_bed_outlined,
              onTap       : () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SabanaScreen()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Tarjeta de selección de producto ────────────────────────────────────────
class _TarjetaProducto extends StatelessWidget {
  final String titulo;
  final String descripcion;
  final IconData icono;
  final VoidCallback onTap;

  const _TarjetaProducto({
    required this.titulo,
    required this.descripcion,
    required this.icono,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFd4a9c2), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFd4a9c2).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 64, height: 64,
              decoration: BoxDecoration(
                color: const Color(0xFFf3e4e9),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icono, color: const Color(0xFFc45a77), size: 34),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(titulo,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF7a235f),
                      )),
                  const SizedBox(height: 4),
                  Text(descripcion,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF5a3d54))),
                ],
              ),
            ),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFFc45a77), size: 28),
          ],
        ),
      ),
    );
  }
}