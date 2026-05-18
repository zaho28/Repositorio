import 'package:flutter/material.dart';
import 'dart:convert';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/services/api_service.dart';
import '../../data/models/usuario_model.dart';

class HistorialVentasScreen extends StatefulWidget {
  final UsuarioModel usuario;
  const HistorialVentasScreen({super.key, required this.usuario});

  @override
  State<HistorialVentasScreen> createState() => _HistorialVentasScreenState();
}

class _HistorialVentasScreenState extends State<HistorialVentasScreen> {
  bool cargando = true;
  String? error;
  Map<String, dynamic>? resumen;
  List topProductos = [];
  List resumenMensual = [];

  DateTime fechaDesde = DateTime.now().subtract(const Duration(days: 30));
  DateTime fechaHasta = DateTime.now();

  @override
  void initState() {
    super.initState();
    cargarDatos();
  }

  Future<void> cargarDatos() async {
    try {
      setState(() { cargando = true; error = null; });

      final params = 'desde=${fechaDesde.toIso8601String().split('T')[0]}&hasta=${fechaHasta.toIso8601String().split('T')[0]}';

      final resumenRes = await ApiService.get('${AppConstants.resumenGeneral}?$params');
      final topRes = await ApiService.get('${AppConstants.topProductos}?$params&limit=10');
      final mensualRes = await ApiService.get(AppConstants.resumenMensual);

      if (resumenRes.statusCode == 200) resumen = jsonDecode(resumenRes.body);
      if (topRes.statusCode == 200) topProductos = jsonDecode(topRes.body);
      if (mensualRes.statusCode == 200) resumenMensual = jsonDecode(mensualRes.body);

      setState(() { cargando = false; });
    } catch (e) {
      setState(() { cargando = false; error = 'Error de conexión'; });
    }
  }

  Future<void> seleccionarFecha(BuildContext context, bool esDesde) async {
    final fecha = await showDatePicker(
      context: context,
      initialDate: esDesde ? fechaDesde : fechaHasta,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primario),
        ),
        child: child!,
      ),
    );
    if (fecha != null) {
      setState(() {
        if (esDesde) fechaDesde = fecha;
        else fechaHasta = fecha;
      });
      cargarDatos();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Historial de Ventas'),
      backgroundColor: AppColors.fondo,
      body: Column(
        children: [
          // Filtros de fecha
          Container(
            color: AppColors.blanco,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => seleccionarFecha(context, true),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.suave),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Desde', style: TextStyle(fontSize: 11, color: AppColors.texto)),
                          Text(fechaDesde.toIso8601String().split('T')[0],
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.secundario)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: GestureDetector(
                    onTap: () => seleccionarFecha(context, false),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.suave),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Hasta', style: TextStyle(fontSize: 11, color: AppColors.texto)),
                          Text(fechaHasta.toIso8601String().split('T')[0],
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.secundario)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: cargarDatos,
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primario),
                  child: const Text('Actualizar', style: TextStyle(color: AppColors.blanco)),
                ),
              ],
            ),
          ),

          // Contenido
          Expanded(
            child: cargando
                ? const Center(child: CircularProgressIndicator(color: AppColors.primario))
                : error != null
                ? Center(child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(error!, style: const TextStyle(color: Colors.red)),
                const SizedBox(height: 16),
                ElevatedButton(onPressed: cargarDatos, child: const Text('Reintentar')),
              ],
            ))
                : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats
                  if (resumen != null)
                    Row(
                      children: [
                        _StatCard(
                          label: 'Total Entradas',
                          value: '${resumen!['totalEntradas'] ?? 0}',
                          color: Colors.green.shade50,
                          borderColor: Colors.green.shade200,
                          textColor: Colors.green.shade800,
                        ),
                        const SizedBox(width: 12),
                        _StatCard(
                          label: 'Total Salidas',
                          value: '${resumen!['totalSalidas'] ?? 0}',
                          color: Colors.red.shade50,
                          borderColor: Colors.red.shade200,
                          textColor: Colors.red.shade800,
                        ),
                      ],
                    ),
                  const SizedBox(height: 20),

                  // Resumen mensual
                  if (resumenMensual.isNotEmpty) ...[
                    const Text('Resumen Mensual',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.secundario)),
                    const SizedBox(height: 10),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.blanco,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            decoration: const BoxDecoration(
                              color: AppColors.primario,
                              borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
                            ),
                            child: const Row(
                              children: [
                                Expanded(child: Text('Mes', style: TextStyle(color: AppColors.blanco, fontWeight: FontWeight.bold))),
                                Expanded(child: Text('Entradas', style: TextStyle(color: AppColors.blanco, fontWeight: FontWeight.bold), textAlign: TextAlign.center)),
                                Expanded(child: Text('Salidas', style: TextStyle(color: AppColors.blanco, fontWeight: FontWeight.bold), textAlign: TextAlign.right)),
                              ],
                            ),
                          ),
                          ...resumenMensual.map((m) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            decoration: BoxDecoration(
                              border: Border(bottom: BorderSide(color: AppColors.suave.withValues(alpha: 0.5))),
                            ),
                            child: Row(
                              children: [
                                Expanded(child: Text('${m['mes']}', style: const TextStyle(fontWeight: FontWeight.w500))),
                                Expanded(child: Text('${m['entradas'] ?? 0}',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(color: Colors.green.shade700, fontWeight: FontWeight.bold))),
                                Expanded(child: Text('${m['salidas'] ?? 0}',
                                    textAlign: TextAlign.right,
                                    style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold))),
                              ],
                            ),
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Top productos
                  if (topProductos.isNotEmpty) ...[
                    const Text('Productos Más Movidos',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.secundario)),
                    const SizedBox(height: 10),
                    ...topProductos.asMap().entries.map((entry) {
                      final i = entry.key;
                      final p = entry.value;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.blanco,
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [BoxShadow(color: Colors.grey.withValues(alpha: 0.1), blurRadius: 4)],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 30, height: 30,
                              decoration: BoxDecoration(color: AppColors.primario, shape: BoxShape.circle),
                              child: Center(child: Text('${i + 1}',
                                  style: const TextStyle(color: AppColors.blanco, fontWeight: FontWeight.bold))),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('${p['producto']}', style: const TextStyle(fontWeight: FontWeight.w600)),
                                  Text('Movimientos: ${p['total_movimientos']}',
                                      style: const TextStyle(fontSize: 12, color: Colors.grey)),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('+${p['entradas'] ?? 0}',
                                    style: TextStyle(color: Colors.green.shade700, fontWeight: FontWeight.bold)),
                                Text('-${p['salidas'] ?? 0}',
                                    style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ],
                        ),
                      );
                    }),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value;
  final Color color, borderColor, textColor;

  const _StatCard({
    required this.label,
    required this.value,
    required this.color,
    required this.borderColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.texto)),
            const SizedBox(height: 4),
            Text(value, style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: textColor)),
          ],
        ),
      ),
    );
  }
}