import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Data/Models/pedido_personalizado_model.dart';
import 'package:gurama_online/Provider/sabana_provider.dart';
import 'package:gurama_online/Provider/auth_provider.dart';

class SabanaScreen extends StatelessWidget {
  const SabanaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => SabanaProvider(),
      child: const _SabanaBody(),
    );
  }
}

class _SabanaBody extends StatefulWidget {
  const _SabanaBody();
  @override
  State<_SabanaBody> createState() => _SabanaBodyState();
}

class _SabanaBodyState extends State<_SabanaBody> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SabanaProvider>().cargarMateriales();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SabanaProvider>();
    final usuario  = context.read<AuthProvider>().usuario;

    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text('Sábana Personalizada',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: const Color(0xFFb4788b),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: provider.cargandoMateriales
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFc45a77)))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            if (provider.error != null) _BannerError(mensaje: provider.error!),

            // ── Paso 1: Tamaño ────────────────────────────────────
            _SeccionTitulo(numero: '1', texto: 'Tamaño de sábana'),
            const SizedBox(height: 10),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, crossAxisSpacing: 8,
                  mainAxisSpacing: 8, childAspectRatio: 2.5),
              itemCount: tamaniosSabana.length,
              itemBuilder: (_, i) {
                final t = tamaniosSabana[i];
                final sel = provider.tamanio?.nombre == t.nombre;
                return GestureDetector(
                  onTap: () => provider.seleccionarTamanio(t),
                  child: Container(
                    decoration: BoxDecoration(
                        color: sel ? const Color(0xFFf3e4e9) : Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                            color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2),
                            width: sel ? 2 : 1)),
                    child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Icon(sel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                          color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2), size: 14),
                      const SizedBox(width: 6),
                      Column(mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(t.nombre, style: TextStyle(
                                fontSize: 13, fontWeight: FontWeight.w600,
                                color: sel ? const Color(0xFFc45a77) : const Color(0xFF5a3d54))),
                            Text('(${t.medidas})',
                                style: const TextStyle(fontSize: 9, color: Colors.grey)),
                          ]),
                    ]),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // ── Paso 2: Tipo de tela ──────────────────────────────
            _SeccionTitulo(numero: '2', texto: 'Tipo de tela'),
            const SizedBox(height: 10),
            _ListaMateriales(
              materiales: provider.materiales,
              seleccionado: provider.material,
              onTap: provider.seleccionarMaterial,
            ),
            const SizedBox(height: 24),

            // ── Paso 3: Color ─────────────────────────────────────
            if (provider.material != null) ...[
              _SeccionTitulo(numero: '3', texto: 'Color de tela'),
              const SizedBox(height: 10),
              provider.cargandoColores
                  ? const _MiniLoader()
                  : _ListaColores(
                  colores: provider.colores,
                  seleccionado: provider.color,
                  onTap: provider.seleccionarColor),
              const SizedBox(height: 24),
            ],

            // ── Paso 4: Extras ────────────────────────────────────
            _SeccionTitulo(numero: '4', texto: 'Extras'),
            const SizedBox(height: 10),
            // Sobresábana
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFd4a9c2))),
              child: Row(children: [
                Checkbox(
                  value: provider.conSobresabana,
                  activeColor: const Color(0xFFc45a77),
                  onChanged: (v) => provider.toggleSobresabana(v ?? false),
                ),
                const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Incluir sobresábana',
                      style: TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF5a3d54))),
                  Text('+2 metros de tela adicionales',
                      style: TextStyle(fontSize: 11, color: Colors.grey)),
                ]),
              ]),
            ),
            const SizedBox(height: 10),
            // Fundas
            const Text('Fundas de almohada',
                style: TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF5a3d54))),
            const SizedBox(height: 6),
            ...[
              (0, 'Sin fundas',  'No incluir'),
              (1, 'Una funda',   '+1 metro de tela'),
              (2, 'Dos fundas',  '+2 metros de tela'),
            ].map((item) {
              final (val, titulo, sub) = item;
              final sel = provider.fundas == val;
              return GestureDetector(
                onTap: () => provider.seleccionarFundas(val),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                      color: sel ? const Color(0xFFf3e4e9) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2),
                          width: sel ? 2 : 1)),
                  child: Row(children: [
                    Icon(sel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                        color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2), size: 20),
                    const SizedBox(width: 10),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(titulo, style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: sel ? const Color(0xFFc45a77) : const Color(0xFF5a3d54))),
                      Text(sub, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    ]),
                  ]),
                ),
              );
            }),
            const SizedBox(height: 24),

            // ── Paso 5: Método de pago ────────────────────────────
            _SeccionTitulo(numero: '5', texto: 'Método de pago'),
            const SizedBox(height: 10),
            _SelectorMetodoPago(
              valor: provider.metodoPago,
              onChanged: provider.seleccionarMetodoPago,
            ),
            const SizedBox(height: 24),

            // ── Resumen de precio ─────────────────────────────────
            if (provider.tamanio != null && provider.material != null)
              _ResumenPrecio(provider: provider),
            const SizedBox(height: 24),

            // ── Botón confirmar ───────────────────────────────────
            SizedBox(
              width: double.infinity, height: 55,
              child: ElevatedButton(
                onPressed: provider.formularioCompleto && !provider.enviando
                    ? () => _confirmar(context, provider, usuario?.idUsuario ?? '')
                    : null,
                style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFc45a77),
                    disabledBackgroundColor: const Color(0xFFd4a9c2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
                child: provider.enviando
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Confirmar Pedido',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmar(BuildContext context, SabanaProvider provider, String idUsuario) async {
    final respuesta = await provider.enviarPedido(idUsuario);
    if (!context.mounted) return;
    if (respuesta != null && respuesta.success) {
      provider.limpiar();
      _mostrarExito(context, respuesta);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(provider.error ?? 'Error al crear el pedido'),
          backgroundColor: const Color(0xFFc45a77),
          behavior: SnackBarBehavior.floating));
    }
  }

  void _mostrarExito(BuildContext context, PedidoPersonalizadoRespuesta r) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Column(children: [
          Container(width: 56, height: 56,
              decoration: const BoxDecoration(color: Color(0xFFf3e4e9), shape: BoxShape.circle),
              child: const Icon(Icons.check_circle_outline_rounded, color: Color(0xFF7a235f), size: 34)),
          const SizedBox(height: 10),
          const Text('¡Pedido creado!',
              style: TextStyle(color: Color(0xFF7a235f), fontWeight: FontWeight.bold)),
        ]),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          _FilaDialog('Ticket',   '#${r.numTicket}'),
          _FilaDialog('Producto', r.tipoProducto),
          _FilaDialog('Tamaño',   r.tamanio),
          _FilaDialog('Total',    r.precioFormateado),
        ]),
        actions: [
          SizedBox(width: double.infinity,
              child: ElevatedButton(
                  onPressed: () { Navigator.pop(context); Navigator.pop(context); },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFc45a77),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
                  child: const Text('Aceptar', style: TextStyle(color: Colors.white)))),
        ],
      ),
    );
  }
}

// ─── Widgets ──────────────────────────────────────────────────────────────────

class _SeccionTitulo extends StatelessWidget {
  final String numero;
  final String texto;
  const _SeccionTitulo({required this.numero, required this.texto});

  @override
  Widget build(BuildContext context) => Row(children: [
    Container(
      width: 26, height: 26,
      decoration: const BoxDecoration(color: Color(0xFFc45a77), shape: BoxShape.circle),
      child: Center(child: Text(numero,
          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold))),
    ),
    const SizedBox(width: 8),
    Text(texto, style: const TextStyle(
        fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF7a235f))),
  ]);
}

class _ListaMateriales extends StatelessWidget {
  final List<MaterialModel> materiales;
  final MaterialModel? seleccionado;
  final Function(MaterialModel) onTap;
  const _ListaMateriales({required this.materiales, required this.seleccionado, required this.onTap});

  @override
  Widget build(BuildContext context) {
    if (materiales.isEmpty) return const _MensajeVacio(texto: 'No hay materiales disponibles');
    return Column(
      children: materiales.map((m) {
        final sel = seleccionado?.idMaterial == m.idMaterial;
        return GestureDetector(
          onTap: m.disponible ? () => onTap(m) : null,
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
                color: sel ? const Color(0xFFf3e4e9) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2),
                    width: sel ? 2 : 1)),
            child: Row(children: [
              if (sel) const Icon(Icons.check, color: Color(0xFFc45a77), size: 18)
              else const SizedBox(width: 18),
              const SizedBox(width: 8),
              Expanded(child: Text(m.nombre, style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: m.disponible ? const Color(0xFF5a3d54) : Colors.grey))),
              Text(m.precioFormateado,
                  style: const TextStyle(color: Color(0xFFc45a77), fontSize: 13, fontWeight: FontWeight.w600)),
            ]),
          ),
        );
      }).toList(),
    );
  }
}

class _ListaColores extends StatelessWidget {
  final List<ColorModel> colores;
  final ColorModel? seleccionado;
  final Function(ColorModel) onTap;
  const _ListaColores({required this.colores, required this.seleccionado, required this.onTap});

  @override
  Widget build(BuildContext context) {
    if (colores.isEmpty) return const _MensajeVacio(texto: 'No hay colores para este material');
    return Wrap(
      spacing: 10, runSpacing: 10,
      children: colores.map((c) {
        final sel = seleccionado?.idColor == c.idColor;
        return GestureDetector(
          onTap: () => onTap(c),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
                color: sel ? const Color(0xFFf3e4e9) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                    color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2),
                    width: sel ? 2 : 1)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              Container(width: 16, height: 16,
                  decoration: BoxDecoration(color: Color(c.colorValue), shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Text(c.nombre, style: TextStyle(
                  fontSize: 13,
                  color: sel ? const Color(0xFFc45a77) : const Color(0xFF5a3d54),
                  fontWeight: sel ? FontWeight.w600 : FontWeight.normal)),
              if (sel) const Text(' ✓', style: TextStyle(color: Color(0xFFc45a77))),
            ]),
          ),
        );
      }).toList(),
    );
  }
}

class _SelectorMetodoPago extends StatelessWidget {
  final String? valor;
  final Function(String) onChanged;
  const _SelectorMetodoPago({required this.valor, required this.onChanged});

  static const List<String> _metodos = [
    'Efectivo contra entrega',
    'Transferencia bancaria',
    'Tarjeta débito/crédito',
  ];

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14),
    decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFd4a9c2))),
    child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: valor, isExpanded: true,
          hint: const Text('Selecciona método de pago',
              style: TextStyle(color: Color(0xFF5a3d54))),
          items: _metodos.map((m) =>
              DropdownMenuItem(value: m, child: Text(m))).toList(),
          onChanged: (v) { if (v != null) onChanged(v); },
        )),
  );
}

class _ResumenPrecio extends StatelessWidget {
  final SabanaProvider provider;
  const _ResumenPrecio({required this.provider});

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
        color: const Color(0xFF7a235f),
        borderRadius: BorderRadius.circular(12)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Resumen del pedido',
          style: TextStyle(color: Color(0xFFd4a9c2), fontSize: 12, fontWeight: FontWeight.w600)),
      const SizedBox(height: 8),
      Text('Tela: ${provider.material?.nombre ?? '—'}',
          style: const TextStyle(color: Colors.white70, fontSize: 12)),
      Text('Color: ${provider.color?.nombre ?? '—'}',
          style: const TextStyle(color: Colors.white70, fontSize: 12)),
      Text('Tamaño: ${provider.tamanio?.nombre ?? '—'} (${provider.tamanio?.medidas ?? ''})',
          style: const TextStyle(color: Colors.white70, fontSize: 12)),
      Text('Metros totales: ${provider.metrosTotales.toStringAsFixed(0)} m',
          style: const TextStyle(color: Colors.white70, fontSize: 12)),
      if (provider.fundas > 0)
        Text('Fundas: ${provider.fundas}',
            style: const TextStyle(color: Colors.white70, fontSize: 12)),
      if (provider.conSobresabana)
        const Text('Incluye sobresábana',
            style: TextStyle(color: Colors.white70, fontSize: 12)),
      const SizedBox(height: 10),
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        const Text('Precio estimado',
            style: TextStyle(color: Color(0xFFd4a9c2), fontSize: 13)),
        Text(provider.precioEstimadoFormateado,
            style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
      ]),
    ]),
  );
}

class _FilaDialog extends StatelessWidget {
  final String etiqueta; final String valor;
  const _FilaDialog(this.etiqueta, this.valor);
  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(etiqueta, style: const TextStyle(color: Colors.grey, fontSize: 13)),
        Text(valor, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF7a235f), fontSize: 13)),
      ]));
}

class _BannerError extends StatelessWidget {
  final String mensaje;
  const _BannerError({required this.mensaje});
  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(color: const Color(0xFFFFEBEE),
          borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.red.shade200)),
      child: Row(children: [
        const Icon(Icons.error_outline, color: Colors.red, size: 18),
        const SizedBox(width: 8),
        Expanded(child: Text(mensaje, style: const TextStyle(color: Colors.red, fontSize: 12))),
      ]));
}

class _MiniLoader extends StatelessWidget {
  const _MiniLoader();
  @override
  Widget build(BuildContext context) => const Center(
      child: Padding(padding: EdgeInsets.all(12),
          child: CircularProgressIndicator(color: Color(0xFFc45a77), strokeWidth: 2)));
}

class _MensajeVacio extends StatelessWidget {
  final String texto;
  const _MensajeVacio({required this.texto});
  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.white,
          borderRadius: BorderRadius.circular(8), border: Border.all(color: const Color(0xFFd4a9c2))),
      child: Text(texto, style: const TextStyle(color: Color(0xFF5a3d54), fontSize: 13)));
}