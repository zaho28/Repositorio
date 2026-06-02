/*import 'package:flutter/material.dart';
import 'dart:convert';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/constants/app_constants.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/services/api_service.dart';
import '../../Data/models/usuario_model.dart';
import '../../Data/models/reporte_model.dart';

class ReportesScreen extends StatefulWidget {
  final UsuarioModel usuario;
  const ReportesScreen({super.key, required this.usuario});

  @override
  State<ReportesScreen> createState() => _ReportesScreenState();
}

class _ReportesScreenState extends State<ReportesScreen> {
  bool cargando = true;
  String? error;
  ResumenGeneralModel? resumenGeneral;
  List pedidos = [];
  List<TopProductoModel> productosStockBajo = [];

  @override
  void initState() {
    super.initState();
    cargarDatos();
  }

  Future<void> cargarDatos() async {
    try {
      setState(() { cargando = true; error = null; });

      final resumenRes = await ApiService.get(AppConstants.resumenGeneral);
      final topRes = await ApiService.get('${AppConstants.topProductos}?limit=5');
      final pedidosRes = await ApiService.get(AppConstants.obtenerPedidos);

      if (resumenRes.statusCode == 200) {
        resumenGeneral = ResumenGeneralModel.fromJson(
          jsonDecode(resumenRes.body) as Map<String, dynamic>,
        );
      }
      if (topRes.statusCode == 200) {
        final top = (jsonDecode(topRes.body) as List)
            .map((p) => TopProductoModel.fromJson(p as Map<String, dynamic>))
            .toList();
        productosStockBajo = top.where((p) => p.tieneStockBajo).toList();
      }
      if (pedidosRes.statusCode == 200) {
        pedidos = jsonDecode(pedidosRes.body);
      }

      setState(() { cargando = false; });
    } catch (e) {
      setState(() { cargando = false; error = 'Error de conexión'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Reportes'),
      backgroundColor: AppColors.fondo,
      body: cargando
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
          : RefreshIndicator(
        onRefresh: cargarDatos,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats
              if (resumenGeneral != null) ...[
                Row(
                  children: [
                    _StatCard(
                      label: 'Total Entradas',
                      value: '${resumenGeneral!.totalEntradas}',
                      sub: 'unidades recibidas',
                      color: Colors.green.shade50,
                      borderColor: Colors.green.shade200,
                    ),
                    const SizedBox(width: 12),
                    _StatCard(
                      label: 'Total Salidas',
                      value: '${resumenGeneral!.totalSalidas}',
                      sub: 'unidades vendidas',
                      color: Colors.red.shade50,
                      borderColor: Colors.red.shade200,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _StatCard(
                      label: 'Balance Neto',
                      value: '${resumenGeneral!.balanceNeto}',
                      sub: 'diferencia',
                      color: Colors.blue.shade50,
                      borderColor: Colors.blue.shade200,
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 20),

              // Productos stock bajo
              if (productosStockBajo.isNotEmpty) ...[
                const Text('⚠ Productos con Stock Bajo',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                const SizedBox(height: 10),
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.blanco,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Column(
                    children: productosStockBajo.map((p) => ListTile(
                      title: Text(p.producto, style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text('Mínimo: ${p.stockMinimo}'),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red.shade100,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text('${p.stockActual}',
                            style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                      ),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Últimos pedidos
              const Text('Últimos Pedidos',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.secundario)),
              const SizedBox(height: 10),
              ...pedidos.take(10).map((p) {
                final ticket = p['ticket_compra'];
                final total = ticket != null ? (ticket['total_ticket'] ?? 0) : 0;
                final estado = ticket?['estado_pago']?['nom_metodo'] ?? p['estado'] ?? '-';
                final usuario = p['usuario'];
                final nombre = usuario != null
                    ? '${usuario['nom_1'] ?? ''} ${usuario['ape_1'] ?? ''}'
                    : 'Sin nombre';
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.blanco,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.1), blurRadius: 4)],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('#${p['id_pedido']}',
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primario)),
                          Text(nombre, style: const TextStyle(fontSize: 13)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('\$$total', style: const TextStyle(fontWeight: FontWeight.bold)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: estado == 'Pagado' ? Colors.green.shade100 : Colors.orange.shade100,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(estado,
                                style: TextStyle(
                                  fontSize: 11,
                                  color: estado == 'Pagado' ? Colors.green.shade800 : Colors.orange.shade800,
                                )),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value, sub;
  final Color color, borderColor;

  const _StatCard({
    required this.label,
    required this.value,
    required this.sub,
    required this.color,
    required this.borderColor,
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
            Text(value, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800)),
            Text(sub, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}*/