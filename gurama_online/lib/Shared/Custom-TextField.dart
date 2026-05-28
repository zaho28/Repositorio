import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isPassword;
  final TextEditingController? controller;
  final TextInputType keyboardType;

  const CustomTextField ({
    super.key,
    required this.label,
    required this.icon,
    this.isPassword = false,
    this.controller,
    this.keyboardType = TextInputType.text
});

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: isPassword, // Si isPassword=true, muestra *** en vez del texto
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        // Color de la etiqueta cuando el campo está activo
        labelStyle: const TextStyle(color: Color(0xFF7a235f)),
        prefixIcon: Icon(icon, color: const Color(0xFFc45a77)), // Ícono en rosa fuerte
        // Borde normal (cuando no está seleccionado)
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15), // Semiredondeado
        ),
        // Borde cuando el campo está seleccionado/activo
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: Color(0xFFc45a77), width: 2),
        ),
        // Borde normal sin selección
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: Color(0xFFd4a9c2)),
        ),
        filled: true, // Activa el color de fondo del campo
        fillColor: const Color(0xFFf3e4e9), // Rosa muy claro de fondo
      ),
    );
  }
}