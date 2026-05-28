import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Data/Models/pedido_personalizado_model.dart';
import 'package:gurama_online/Provider/cubrelecho_provider.dart';
import 'package:gurama_online/Provider/auth_provider.dart';

class CubrelectoScreen extends StatelessWidget {
  const CubrelectoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => CubrelectoProvider(),
      child: const _CubrelectoBody(),
    );
  }
}

class _CubrelectoBody extends StatefulWidget {
  const _CubrelectoBody();
  @override
  State<_CubrelectoBody> createState() => _CubrelectoBodyState();
}

class _CubrelectoBodyState extends State<_CubrelectoBody> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CubrelectoProvider>().cargarMateriales();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CubrelectoProvider>();
    final usuario  = context.read<AuthProvider>().usuario;

    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        title: const Text('Cubre Lecho Personalizado',
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

            // ── Tamaño ────────────────────────────────────────────
            _SeccionTitulo(numero: '1', texto: 'Tamaño de cama'),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8, runSpacing: 8,
              children: tamaniosCubrelecho.map((t) {
                final sel = provider.tamanio?.nombre == t.nombre;
                return GestureDetector(
                  onTap: () => provider.seleccionarTamanio(t),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    decoration: BoxDecoration(
                        color: sel ? const Color(0xFFf3e4e9) : Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2),
                            width: sel ? 2 : 1)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(sel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                          color: sel ? const Color(0xFFc45a77) : const Color(0xFFd4a9c2), size: 16),
                      const SizedBox(width: 6),
                      Text(t.nombre, style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: sel ? const Color(0xFFc45a77) : const Color(0xFF5a3d54))),
                    ]),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // ── Tabs Lado 1 / Lado 2 ──────────────────────────────
            _SeccionTitulo(numero: '2', texto: 'Tipo de tela'),
            const SizedBox(height: 10),
            Row(children: [
              _TabBtn(label: 'Lado 1', activo: provider.ladoActivo == 1,
                  completado: provider.materialLado1 != null && provider.colorLado1 != null,
                  onTap: () => provider.setLadoActivo(1)),
              const SizedBox(width: 8),
              _TabBtn(label: 'Lado 2', activo: provider.ladoActivo == 2,
                  completado: provider.materialLado2 != null && provider.colorLado2 != null,
                  onTap: () => provider.setLadoActivo(2)),
            ]),
            const SizedBox(height: 12),

            // ── Contenido del lado activo ─────────────────────────
            if (provider.ladoActivo == 1) ...[
              _ListaMateriales(
                materiales: provider.materiales,
                seleccionado: provider.materialLado1,
                onTap: provider.seleccionarMaterialLado1,
              ),
              if (provider.materialLado1 != null) ...[
                const SizedBox(height: 16),
                _SeccionTitulo(numero: '3', texto: 'Color — Lado 1'),
                const SizedBox(height: 10),
                provider.cargandoColores1
                    ? const _MiniLoader()
                    : _ListaColores(
                    colores: provider.colores1,
                    seleccionado: provider.colorLado1,
                    onTap: provider.seleccionarColorLado1),
              ],
            ] else ...[
              _ListaMateriales(
                materiales: provider.materiales,
                seleccionado: provider.materialLado2,
                onTap: provider.seleccionarMaterialLado2,
              ),
              if (provider.materialLado2 != null) ...[
                const SizedBox(height: 16),
                _SeccionTitulo(numero: '3', texto: 'Color — Lado 2'),
                const SizedBox(height: 10),
                provider.cargandoColores2
                    ? const _MiniLoader()
                    : _ListaColores(
                    colores: provider.colores2,
                    seleccionado: provider.colorLado2,
                    onTap: provider.seleccionarColorLado2),
              ],
            ],
            const SizedBox(height: 24),

            // ── Método de pago ────────────────────────────────────
            _SeccionTitulo(numero: '4', texto: 'Método de pago'),
            const SizedBox(height: 10),
            _SelectorMetodoPago(
              valor: provider.metodoPago,
              onChanged: provider.seleccionarMetodoPago,
            ),
            const SizedBox(height: 24),

            // ── Resumen de precio ─────────────────────────────────
            if (provider.tamanio != null && provider.materialLado1 != null)
              _ResumenPrecio(
                tamanio  : provider.tamanio!.nombre,
                metros   : provider.tamanio!.metros,
                precio   : provider.precioTotalFormateado,
                lado1    : provider.materialLado1?.nombre,
                color1   : provider.colorLado1?.nombre,
                lado2    : provider.materialLado2?.nombre,
                color2   : provider.colorLado2?.nombre,
              ),
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

  Future<void> _confirmar(BuildContext context, CubrelectoProvider provider, String idUsuario) async {
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
  Widget build(BuildContext context) {
    return Row(children: [
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
}

class _TabBtn extends StatelessWidget {
  final String label;
  final bool activo;
  final bool completado;
  final VoidCallback onTap;
  const _TabBtn({required this.label, required this.activo, required this.completado, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
        decoration: BoxDecoration(
            color: activo ? const Color(0xFF7a235f) : Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFFd4a9c2))),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Text('$label ${completado ? '✓' : ''}', style: TextStyle(
              color: activo ? Colors.white : const Color(0xFF5a3d54),
              fontWeight: FontWeight.w600)),
        ]),
      ),
    );
  }
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
              if (!m.disponible)
                const Padding(padding: EdgeInsets.only(left: 6),
                    child: Chip(label: Text('Sin stock', style: TextStyle(fontSize: 9, color: Colors.white)),
                        backgroundColor: Colors.grey, padding: EdgeInsets.zero)),
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

  // Métodos de pago reales del negocio
  static const List<String> _metodos = [
    'Efectivo contra entrega',
    'Transferencia bancaria',
    'Tarjeta débito/crédito',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
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
        ),
      ),
    );
  }
}

class _ResumenPrecio extends StatelessWidget {
  final String tamanio;
  final double metros;
  final String precio;
  final String? lado1;
  final String? color1;
  final String? lado2;
  final String? color2;

  const _ResumenPrecio({
    required this.tamanio, required this.metros, required this.precio,
    this.lado1, this.color1, this.lado2, this.color2});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: const Color(0xFF7a235f),
          borderRadius: BorderRadius.circular(12)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Resumen del pedido',
            style: TextStyle(color: Color(0xFFd4a9c2), fontSize: 12, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Text('Tamaño: $tamanio  ·  ${metros.toStringAsFixed(0)} m totales',
            style: const TextStyle(color: Colors.white70, fontSize: 12)),
        if (lado1 != null)
          Text('Lado 1: $lado1${color1 != null ? ' · $color1' : ''}',
              style: const TextStyle(color: Colors.white70, fontSize: 12)),
        if (lado2 != null)
          Text('Lado 2: $lado2${color2 != null ? ' · $color2' : ''}',
              style: const TextStyle(color: Colors.white70, fontSize: 12)),
        const SizedBox(height: 10),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Text('Precio estimado',
              style: TextStyle(color: Color(0xFFd4a9c2), fontSize: 13)),
          Text(precio,
              style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
        ]),
      ]),
    );
  }
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