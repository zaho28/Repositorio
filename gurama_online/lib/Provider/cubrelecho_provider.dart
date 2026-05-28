import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:gurama_online/Data/Models/pedido_personalizado_model.dart';

const String _base = 'http://10.0.2.2:3000';

class CubrelectoProvider extends ChangeNotifier {

  // ── Carga ─────────────────────────────────────────────────────────────────
  bool    _cargandoMateriales  = false;
  bool    _cargandoColores1    = false;
  bool    _cargandoColores2    = false;
  bool    _enviando            = false;
  String? _error;
  int     _ladoActivo          = 1; // 1 o 2, para mostrar en el tab

  bool    get cargandoMateriales => _cargandoMateriales;
  bool    get cargandoColores1   => _cargandoColores1;
  bool    get cargandoColores2   => _cargandoColores2;
  bool    get enviando           => _enviando;
  String? get error              => _error;
  int     get ladoActivo         => _ladoActivo;

  // ── Datos del backend ─────────────────────────────────────────────────────
  List<MaterialModel> _materiales  = [];
  List<ColorModel>    _colores1    = [];
  List<ColorModel>    _colores2    = [];

  List<MaterialModel> get materiales => _materiales;
  List<ColorModel>    get colores1   => _colores1;
  List<ColorModel>    get colores2   => _colores2;

  // ── Selecciones ───────────────────────────────────────────────────────────
  TamanioCubrelecho? _tamanio;
  MaterialModel?     _materialLado1;
  ColorModel?        _colorLado1;
  MaterialModel?     _materialLado2;
  ColorModel?        _colorLado2;
  String?            _metodoPago;

  TamanioCubrelecho? get tamanio       => _tamanio;
  MaterialModel?     get materialLado1 => _materialLado1;
  ColorModel?        get colorLado1    => _colorLado1;
  MaterialModel?     get materialLado2 => _materialLado2;
  ColorModel?        get colorLado2    => _colorLado2;
  String?            get metodoPago    => _metodoPago;

  static const List<String> metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta'];

  // ── Cálculo de precio ─────────────────────────────────────────────────────
  // Cada lado usa la mitad de los metros del tamaño seleccionado
  double get metrosPorLado => (_tamanio?.metros ?? 0) / 2;

  double get precioLado1 =>
      metrosPorLado * (_materialLado1?.precioUnitario ?? 0);

  double get precioLado2 =>
      metrosPorLado * (_materialLado2?.precioUnitario ?? 0);

  double get precioTotal => precioLado1 + precioLado2;

  String get precioTotalFormateado =>
      '\$${precioTotal.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';

  bool get formularioCompleto =>
      _tamanio       != null &&
          _materialLado1 != null &&
          _colorLado1    != null &&
          _materialLado2 != null &&
          _colorLado2    != null &&
          _metodoPago    != null;

  // ── Cargar materiales ─────────────────────────────────────────────────────
  Future<void> cargarMateriales() async {
    _cargandoMateriales = true;
    _error = null;
    notifyListeners();
    try {
      final res = await http.get(Uri.parse('$_base/pedidos-personalizados/materiales'));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _materiales = data.map((e) => MaterialModel.fromJson(e)).toList();
      } else {
        _error = 'Error al cargar materiales';
      }
    } catch (e) {
      _error = 'Error de conexión';
    } finally {
      _cargandoMateriales = false;
      notifyListeners();
    }
  }

  Future<void> cargarColoresLado1(int idMaterial) async {
    _cargandoColores1 = true;
    _colores1  = [];
    _colorLado1 = null;
    notifyListeners();
    try {
      final res = await http.get(
          Uri.parse('$_base/pedidos-personalizados/materiales/$idMaterial/colores'));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _colores1 = data.map((e) => ColorModel.fromJson(e)).toList();
      }
    } catch (_) {
      _error = 'Error al cargar colores';
    } finally {
      _cargandoColores1 = false;
      notifyListeners();
    }
  }

  Future<void> cargarColoresLado2(int idMaterial) async {
    _cargandoColores2 = true;
    _colores2  = [];
    _colorLado2 = null;
    notifyListeners();
    try {
      final res = await http.get(
          Uri.parse('$_base/pedidos-personalizados/materiales/$idMaterial/colores'));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _colores2 = data.map((e) => ColorModel.fromJson(e)).toList();
      }
    } catch (_) {
      _error = 'Error al cargar colores';
    } finally {
      _cargandoColores2 = false;
      notifyListeners();
    }
  }

  // ── Setters ───────────────────────────────────────────────────────────────
  void seleccionarTamanio(TamanioCubrelecho t) {
    _tamanio = t;
    notifyListeners();
  }

  void setLadoActivo(int lado) {
    _ladoActivo = lado;
    notifyListeners();
  }

  void seleccionarMaterialLado1(MaterialModel m) {
    _materialLado1 = m;
    _colorLado1    = null;
    notifyListeners();
    cargarColoresLado1(m.idMaterial);
  }

  void seleccionarColorLado1(ColorModel c) {
    _colorLado1 = c;
    notifyListeners();
  }

  void seleccionarMaterialLado2(MaterialModel m) {
    _materialLado2 = m;
    _colorLado2    = null;
    notifyListeners();
    cargarColoresLado2(m.idMaterial);
  }

  void seleccionarColorLado2(ColorModel c) {
    _colorLado2 = c;
    notifyListeners();
  }

  void seleccionarMetodoPago(String m) {
    _metodoPago = m;
    notifyListeners();
  }

  // ── Enviar pedido ─────────────────────────────────────────────────────────
  Future<PedidoPersonalizadoRespuesta?> enviarPedido(String idUsuario) async {
    if (!formularioCompleto) return null;
    _enviando = true;
    _error    = null;
    notifyListeners();
    try {
      // El backend recibe un array de materiales; mandamos los dos lados
      final body = {
        'id_usuario'    : idUsuario,
        'tipo_producto' : 'Cubre_lecho',
        'tamanio'       : _tamanio!.nombre,
        'metodo_pago'   : _metodoPago,
        'materiales'    : [
          {'id_material': _materialLado1!.idMaterial, 'cantidad': metrosPorLado.toInt()},
          {'id_material': _materialLado2!.idMaterial, 'cantidad': metrosPorLado.toInt()},
        ],
      };
      final res = await http.post(
        Uri.parse('$_base/pedidos-personalizados'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      if (res.statusCode == 201) {
        return PedidoPersonalizadoRespuesta.fromJson(jsonDecode(res.body));
      } else {
        _error = jsonDecode(res.body)['message'] ?? 'Error al crear el pedido';
        return null;
      }
    } catch (e) {
      _error = 'Error de conexión';
      return null;
    } finally {
      _enviando = false;
      notifyListeners();
    }
  }

  void limpiar() {
    _tamanio       = null;
    _materialLado1 = null;
    _colorLado1    = null;
    _materialLado2 = null;
    _colorLado2    = null;
    _colores1      = [];
    _colores2      = [];
    _metodoPago    = null;
    _ladoActivo    = 1;
    _error         = null;
    notifyListeners();
  }
}