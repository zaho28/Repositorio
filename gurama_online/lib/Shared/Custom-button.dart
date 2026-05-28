import 'package:flutter/material.dart';

// Widget reutilizable para botones
// Lo usamos en toda la app para mantener el mismo diseño
class CustomButton extends StatelessWidget {
  final String text;              // Texto del botón (ej: "INGRESAR")
  final VoidCallback onPressed;   // La función que se ejecuta al presionar
  final Color backgroundColor;   // Color del botón (tiene un color por defecto)

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.backgroundColor = const Color(0xFFc45a77), // Rosa fuerte por defecto
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity, // El botón ocupa todo el ancho disponible
      height: 55,             // Altura fija del botón
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: Colors.white, // Color del texto encima del botón
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15), // Semiredondeado
          ),
          elevation: 5, // Sombra del botón
        ),
        child: Text(
          text,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}