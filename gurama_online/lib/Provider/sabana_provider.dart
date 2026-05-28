import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:gurama_online/Data/Models/pedido_personalizado_model.dart';

const String _base = 'http://10.0.2.2:3000';

class SabanaProvider extends ChangeNotifier {

  // ── Carga ─────────────────────────────────────────────────────────────────
  bool    _cargandoMateriales = false;
  bool    _cargandoColores    = false;
  bool    _enviando           = false;
  String? _error;

  bool    get cargandoMateriales => _cargandoMateriales;
  bool    get cargandoColores    => _cargandoColores;
  bool    get enviando           => _enviando;
  String? get error              => _error;

  // ── Datos del backend ─────────────────────────────────────────────────────
  List<MaterialModel> _materiales = [];
  List<ColorModel>    _colores    = [];
  List<MaterialModel> get materiales => _materiales;
  List<ColorModel>    get colores    => _colores;

  // ── Selecciones del usuario ───────────────────────────────────────────────
  TamanioSabana?  _tamanio;
  MaterialModel?  _material;
  ColorModel?     _color;
  bool            _conSobresabana = false;
  int             _fundas         = 0; // 0 = sin funda, 1 = una, 2 = dos

  TamanioSabana?  get tamanio         => _tamanio;
  MaterialModel?  get material        => _material;
  ColorModel?     get color           => _color;
  bool            get conSobresabana  => _conSobresabana;
  int             get fundas          => _fundas;

  static const List<String> metodosPago = ['Efectivo', 'Transferencia', 'Tarjeta'];
  String? _metodoPago;
  String? get metodoPago => _metodoPago;

  // ── Cálculo de metros y precio ────────────────────────────────────────────
  // metros base del tamaño + extras
  double get metrosTotales {
    if (_tamanio == null) return 0;
    double metros = _tamanio!.metros;
    if (_conSobresabana) metros += 2;
    if (_fundas == 1)    metros += 1;
    if (_fundas == 2)    metros += 2;
    return metros;
  }

  double get precioEstimado =>
      metrosTotales * (_material?.precioUnitario ?? 0);

  String get precioEstimadoFormateado =>
      '\$${precioEstimado.toStringAsFixed(0).replaceAllMapped(
          RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}';

  // Formulario listo cuando todos los campos obligatorios están llenos
  bool get formularioCompleto =>
      _tamanio   != null &&
          _material  != null &&
          _color     != null &&
          _metodoPago != null;

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

  // ── Cargar colores del material ───────────────────────────────────────────
  Future<void> cargarColores(int idMaterial) async {
    _cargandoColores = true;
    _colores = [];
    _color   = null;
    notifyListeners();
    try {
      final res = await http.get(
          Uri.parse('$_base/pedidos-personalizados/materiales/$idMaterial/colores'));
      if (res.statusCode == 200) {
        final List data = jsonDecode(res.body);
        _colores = data.map((e) => ColorModel.fromJson(e)).toList();
      } else {
        _error = 'Error al cargar colores';
      }
    } catch (e) {
      _error = 'Error de conexión';
    } finally {
      _cargandoColores = false;
      notifyListeners();
    }
  }

  // ── Setters ───────────────────────────────────────────────────────────────
  void seleccionarTamanio(TamanioSabana t) {
    _tamanio = t;
    notifyListeners();
  }

  void seleccionarMaterial(MaterialModel m) {
    _material = m;
    _color    = null;
    notifyListeners();
    cargarColores(m.idMaterial);
  }

  void seleccionarColor(ColorModel c) {
    _color = c;
    notifyListeners();
  }

  void toggleSobresabana(bool val) {
    _conSobresabana = val;
    notifyListeners();
  }

  void seleccionarFundas(int val) {
    _fundas = val;
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
      final body = {
        'id_usuario'    : idUsuario,
        'tipo_producto' : 'Sábana',
        'tamanio'       : _tamanio!.nombre,
        'metodo_pago'   : _metodoPago,
        'materiales'    : [
          {'id_material': _material!.idMaterial, 'cantidad': metrosTotales.toInt()},
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
    _tamanio        = null;
    _material       = null;
    _color          = null;
    _colores        = [];
    _conSobresabana = false;
    _fundas         = 0;
    _metodoPago     = null;
    _error          = null;
    notifyListeners();
  }
}