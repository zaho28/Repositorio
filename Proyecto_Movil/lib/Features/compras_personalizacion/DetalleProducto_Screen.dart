import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../Data/models/producto_model.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/providers/carrito_provider.dart';
import 'Carrito_Screen.dart';

class DetalleProductoScreen extends StatelessWidget {
    final ProductoModel producto;
    const DetalleProductoScreen({super.key, required this.producto});

    @override
    Widget build(BuildContext context) {
        final imgUrl = producto.rutaImagen != null
            ? '${AppConstants.baseUrl}${producto.rutaImagen}'
            : null;

        return Scaffold(
        backgroundColor: const Color(0xFFf3e4e9),
        appBar: AppBar(
            title: Text(producto.nomProducto,
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis),
            backgroundColor: const Color(0xFFb4788b),
            iconTheme: const IconThemeData(color: Colors.white),
            actions: [
            IconButton(
                icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
                onPressed: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const CarritoScreen())),
            ),
            ],
        ),
        body: SingleChildScrollView(
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
                // Imagen
                Container(
                width: double.infinity,
                height: 280,
                color: Colors.white,
                child: imgUrl != null
                    ? Image.network(imgUrl,
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => const Center(
                            child: Icon(Icons.image_not_supported,
                                color: Color(0xFFd4a9c2), size: 80)))
                    : const Center(
                        child: Icon(Icons.shopping_bag_outlined,
                            color: Color(0xFFd4a9c2), size: 80)),
                ),

                Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                    // Nombre y precio
                    Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                        Expanded(
                            child: Text(producto.nomProducto,
                                style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFb4788b))),
                        ),
                        Text(producto.precioFormateado,
                            style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFc45a77))),
                        ],
                    ),
                    const SizedBox(height: 10),

                    // Etiquetas
                    Wrap(
                        spacing: 8,
                        children: [
                        if (producto.nombreCategoria != null)
                            _Etiqueta(producto.nombreCategoria!,
                                const Color(0xFFc45a77)),
                        if (producto.nombreClasificacion != null)
                            _Etiqueta(producto.nombreClasificacion!,
                                const Color(0xFFb4788b)),
                        ],
                    ),
                    const SizedBox(height: 15),

                    // Descripción
                    const Text('Descripción',
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFb4788b))),
                    const SizedBox(height: 8),
                    Text(producto.descripcion ?? '',
                        style: const TextStyle(
                            color: Color(0xFF5a3d54),
                            fontSize: 14,
                            height: 1.5)),
                    const SizedBox(height: 15),

                    // Detalles
                    if (producto.color != null ||
                        producto.talla != null ||
                        producto.tamanio != null) ...[
                        const Text('Detalles',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFb4788b))),
                        const SizedBox(height: 10),
                        if (producto.color != null)
                        _DetalleRow(Icons.palette_outlined, 'Color',
                            producto.color!),
                        if (producto.talla != null)
                        _DetalleRow(Icons.straighten_outlined, 'Talla',
                            producto.talla!),
                        if (producto.tamanio != null)
                        _DetalleRow(Icons.crop_outlined, 'Tamaño',
                            producto.tamanio!),
                        const SizedBox(height: 15),
                    ],

                    // Stock
                    Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12)),
                        child: Row(
                        children: [
                            const Icon(Icons.inventory_2_outlined,
                                color: Color(0xFFc45a77)),
                            const SizedBox(width: 10),
                            Text(
                                'Disponibles: ${producto.stockActual} unidades',
                                style: const TextStyle(
                                    color: Color(0xFF5a3d54),
                                    fontWeight: FontWeight.w500)),
                        ],
                        ),
                    ),
                    const SizedBox(height: 25),

                    // Botón agregar al carrito
                    SizedBox(
                        width: double.infinity,
                        height: 55,
                        child: ElevatedButton.icon(
                        onPressed: producto.stockActual <= 0
                            ? null
                            : () {
                                context.read<CarritoProvider>().agregar(producto);
                                ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                    content: const Text(
                                        '¡Producto agregado al carrito!'),
                                    backgroundColor: const Color(0xFFb4788b),
                                    action: SnackBarAction(
                                        label: 'Ver carrito',
                                        textColor: Colors.white,
                                        onPressed: () => Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                                builder: (_) =>
                                                    const CarritoScreen())),
                                    ),
                                    ),
                                );
                                },
                        icon: const Icon(Icons.shopping_cart_outlined,
                            color: Colors.white),
                        label: const Text('AGREGAR AL CARRITO',
                            style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFc45a77),
                            disabledBackgroundColor: Colors.grey.shade300,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15)),
                        ),
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
    }

    class _Etiqueta extends StatelessWidget {
    final String texto;
    final Color color;
    const _Etiqueta(this.texto, this.color);

    @override
    Widget build(BuildContext context) {
        return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
        decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Text(texto,
            style: TextStyle(
                color: color, fontSize: 12, fontWeight: FontWeight.bold)),
        );
    }
    }

    class _DetalleRow extends StatelessWidget {
    final IconData icon;
    final String label;
    final String value;
    const _DetalleRow(this.icon, this.label, this.value);

    @override
    Widget build(BuildContext context) {
        return Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Row(
            children: [
            Icon(icon, color: const Color(0xFFc45a77), size: 18),
            const SizedBox(width: 8),
            Text('$label: ',
                style: const TextStyle(
                    fontWeight: FontWeight.bold, color: Color(0xFF5a3d54))),
            Text(value,
                style: const TextStyle(color: Color(0xFF5a3d54))),
            ],
        ),
        );
    }
}