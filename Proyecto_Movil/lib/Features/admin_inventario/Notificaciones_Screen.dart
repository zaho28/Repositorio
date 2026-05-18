import 'package:flutter/material.dart';
import 'dart:convert';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/services/api_service.dart';
import '../../data/models/usuario_model.dart';

class NotificacionesScreen extends StatefulWidget {
  final UsuarioModel usuario;
  const NotificacionesScreen({super.key, required this.usuario});

  @override
  State<NotificacionesScreen> createState() => _NotificacionesScreenState();
}

class _NotificacionesScreenState extends State<NotificacionesScreen> {
  bool cargando = true;
  String? error;
  List notificaciones = [];
  Map<String, dynamic>? estadisticas;
  String filtroActivo = 'todas';

  final List<Map<String, dynamic>> filtros = [
    {'key': 'todas', 'label': 'Todas'},
    {'key': 'stock-bajo', 'label': 'Stock Bajo'},
    {'key': 'agotado', 'label': 'Agotados'},
    {'key': 'pedido', 'label': 'Pedidos'},
  ];

  @override
  void initState() {
    super.initState();
    cargarDatos();
  }

  Future<void> cargarDatos() async {
    try {
      setState(() { cargando = true; error = null; });

      final notifRes = await ApiService.get(AppConstants.obtenerNotificaciones);
      final statsRes = await ApiService.get(AppConstants.estadisticasNotificaciones);

      if (notifRes.statusCode == 200) notificaciones = jsonDecode(notifRes.body);
      if (statsRes.statusCode == 200) estadisticas = jsonDecode(statsRes.body);

      setState(() { cargando = false; });
    } catch (e) {
      setState(() { cargando = false; error = 'Error de conexión'; });
    }
  }

  List get notificacionesFiltradas {
    if (filtroActivo == 'todas') return notificaciones;
    return notificaciones.where((n) => n['tipo'] == filtroActivo).toList();
  }

  int contarPorTipo(String tipo) {
    if (tipo == 'todas') return notificaciones.length;
    return notificaciones.where((n) => n['tipo'] == tipo).length;
  }

  Color colorPorTipo(String tipo) {
    switch (tipo) {
      case 'stock-bajo': return Colors.orange;
      case 'agotado': return Colors.red;
      case 'pedido': return Colors.blue;
      default: return Colors.grey;
    }
  }

  String labelPorTipo(String tipo) {
    switch (tipo) {
      case 'stock-bajo': return 'Stock Bajo';
      case 'agotado': return 'Agotado';
      case 'pedido': return 'Pedido';
      default: return 'Info';
    }
  }

  String formatearFecha(String fecha) {
    final date = DateTime.tryParse(fecha);
    if (date == null) return fecha;
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return 'Hace un momento';
    if (diff.inMinutes < 60) return 'Hace ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Hace ${diff.inHours}h';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Notificaciones'),
      backgroundColor: AppColors.fondo,
      body: Column(
        children: [
          // Stats
          if (estadisticas != null)
            Container(
              color: AppColors.blanco,
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  _StatChip(
                    label: 'Stock Bajo',
                    value: '${estadisticas!['productos_stock_bajo'] ?? 0}',
                    color: Colors.orange,
                  ),
                  const SizedBox(width: 8),
                  _StatChip(
                    label: 'Agotados',
                    value: '${estadisticas!['productos_agotados'] ?? 0}',
                    color: Colors.red,
                  ),
                  const SizedBox(width: 8),
                  _StatChip(
                    label: 'Pedidos hoy',
                    value: '${estadisticas!['pedidos_hoy'] ?? 0}',
                    color: Colors.blue,
                  ),
                  const SizedBox(width: 8),
                  _StatChip(
                    label: '7 días',
                    value: '${estadisticas!['pedidos_semana'] ?? 0}',
                    color: Colors.green,
                  ),
                ],
              ),
            ),

          // Filtros
          Container(
            color: AppColors.blanco,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  ...filtros.map((f) => Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setState(() => filtroActivo = f['key']),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: filtroActivo == f['key'] ? AppColors.primario : AppColors.fondo,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.suave),
                        ),
                        child: Text(
                          '${f['label']} (${contarPorTipo(f['key'])})',
                          style: TextStyle(
                            color: filtroActivo == f['key'] ? AppColors.blanco : AppColors.texto,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ),
                  )),
                  GestureDetector(
                    onTap: cargarDatos,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.secundario,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text('Actualizar',
                          style: TextStyle(color: AppColors.blanco, fontWeight: FontWeight.w600, fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Lista
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
                : notificacionesFiltradas.isEmpty
                ? Center(
              child: Text(
                'No hay notificaciones${filtroActivo != 'todas' ? ' de este tipo' : ''}',
                style: const TextStyle(color: Colors.grey),
              ),
            )
                : RefreshIndicator(
              onRefresh: cargarDatos,
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: notificacionesFiltradas.length,
                itemBuilder: (context, i) {
                  final n = notificacionesFiltradas[i];
                  final tipo = n['tipo'] ?? '';
                  final color = colorPorTipo(tipo);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: AppColors.blanco,
                      borderRadius: BorderRadius.circular(10),
                      border: Border(left: BorderSide(color: color, width: 4)),
                      boxShadow: [BoxShadow(color: Colors.grey.withValues(alpha: 0.1), blurRadius: 4)],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: color.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(labelPorTipo(tipo),
                                    style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                              Text(formatearFecha(n['fecha'] ?? ''),
                                  style: const TextStyle(fontSize: 11, color: Colors.grey)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('${n['mensaje']}',
                              style: const TextStyle(fontWeight: FontWeight.w600)),
                          if (n['detalles'] != null) ...[
                            const SizedBox(height: 4),
                            Text('${n['detalles']}',
                                style: const TextStyle(fontSize: 13, color: Colors.grey)),
                          ],
                          if (n['stock_actual'] != null) ...[
                            const SizedBox(height: 4),
                            Text(
                              n['stock_actual'] == 0
                                  ? 'SIN STOCK'
                                  : 'Stock: ${n['stock_actual']} (Mín: ${n['stock_minimo']})',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: n['stock_actual'] == 0 ? Colors.red : Colors.orange,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label, value;
  final Color color;

  const _StatChip({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: color.withValues(alpha: 0.3)),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: color)),
            Text(label, style: const TextStyle(fontSize: 10, color: AppColors.texto), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}