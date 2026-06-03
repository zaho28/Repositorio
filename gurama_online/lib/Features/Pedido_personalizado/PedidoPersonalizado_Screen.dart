import 'package:flutter/material.dart';
import 'package:gurama_online/Features/Pedido_personalizado/Personalizacion_Sabanas_Screen.dart';
import 'package:gurama_online/Features/Pedido_personalizado/Personalizacion_Cubrelechos_Screen.dart';

class PedidoPersonalizadoScreen extends StatelessWidget {
  const PedidoPersonalizadoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text('Pedidos Personalizados',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        iconTheme: const IconThemeData(color: Colors.white),
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
                gradient: const LinearGradient(
                  colors: [Color(0xFFc45a77), Color(0xFF7a235f)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                borderRadius: BorderRadius.circular(20),
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
                          'Elige el tipo de producto, tamano, tela y color. Todo hecho a tu medida.',
                          style: TextStyle(color: Color(0xFFf3e4e9), fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            const Text('Que deseas personalizar?',
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
            const SizedBox(height: 20),

            // Tarjeta Sabanas
            _tarjetaProducto(
              context: context,
              titulo: 'Sabanas',
              descripcion:
              'Personaliza tu sabana con la tela, color, tamano y extras que prefieras.',
              icono: Icons.king_bed_outlined,
              color: const Color(0xFFc45a77),
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
              'Disena tu cubrelecho con dos telas, colores y disenos diferentes.',
              icono: Icons.layers_outlined,
              color: const Color(0xFF7a235f),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => const PersonalizacionCubrelechosScreen())),
            ),
            const SizedBox(height: 25),

            // Nota informativa
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: const Color(0xFFd4a9c2)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: Color(0xFFc45a77)),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'El pago se realiza contra entrega. Recibiras un ticket con los detalles de tu pedido.',
                      style: TextStyle(color: Color(0xFF5a3d54), fontSize: 13),
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
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.2), blurRadius: 8, offset: const Offset(0, 3))
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
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
                          fontSize: 18, fontWeight: FontWeight.bold, color: color)),
                  const SizedBox(height: 5),
                  Text(descripcion,
                      style:
                      const TextStyle(color: Color(0xFF5a3d54), fontSize: 13)),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: color, size: 18),
          ],
        ),
      ),
    );
  }
}