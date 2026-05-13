import 'package:flutter/material.dart';
import '../models/producto.dart';

class ProductoCard extends StatelessWidget {

  final Producto producto;

  const ProductoCard({
    super.key,
    required this.producto,
  });

  @override
  Widget build(BuildContext context) {

    return Container(
      padding: const EdgeInsets.all(12),

      decoration: BoxDecoration(
        color: const Color(0xFFF0D1EB),
        borderRadius: BorderRadius.circular(20),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
          ),
        ],
      ),

      child: Column(
        children: [

          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15),

              child: Image.asset(
                producto.imagen,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ),

          const SizedBox(height: 10),

          Text(
            producto.nombre,
            textAlign: TextAlign.center,

            style: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}