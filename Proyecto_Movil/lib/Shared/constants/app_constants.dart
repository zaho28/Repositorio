class AppConstants {
  // (host cel)
  static const String _baseUrl = 'http://10.186.62.248:3000';
  static const String baseUrl = _baseUrl;

  // API KEY
  static const String apiKey = 'xyz123';

  // Headers globales
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };

  static String getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    final safePath = path.startsWith('/') ? path.substring(1) : path;
    final safeBase = baseUrl.endsWith('/') ? baseUrl : '$baseUrl/';
    return '$safeBase$safePath';
  }

  // Enpoints

  // AUTH
  static const String login = '$_baseUrl/auth/login'; // Post
  static const String verifyCode = '$_baseUrl/auth/verify-code'; // Post
  static const String logout = '$_baseUrl/auth/logout'; // Post

  // USUARIOS
  static const String crearUsuario = '$_baseUrl/usuarios';           // Post
  static const String obtenerUsuarios = '$_baseUrl/usuarios';        // Get
  static const String obtenerUsuario = '$_baseUrl/usuarios';         // Get
  static const String actualizarUsuario = '$_baseUrl/usuarios';      // Patch
  static const String eliminarUsuario = '$_baseUrl/usuarios';        // Delete
  static const String cambiarContrasena = '$_baseUrl/usuarios';      // Patch
  static const String subirImagen = '$_baseUrl/usuarios';            // Post
  static const String solicitarReset = '$_baseUrl/usuarios/solicitar-reset'; // Post
  static const String resetContrasena = '$_baseUrl/usuarios/reset-contrasena'; // Post
  static const String cambiarEstado = '$_baseUrl/usuarios';          // Patch

// PRODUCTOS
  static const String crearProducto = '$_baseUrl/productos';            // Post
  static const String obtenerProductos = '$_baseUrl/productos';         // Get
  static const String verificarProducto = '$_baseUrl/productos/check';  // Get
  static const String obtenerProducto = '$_baseUrl/productos';          // Get
  static const String actualizarProducto = '$_baseUrl/productos';       // Patch
  static const String eliminarProducto = '$_baseUrl/productos';         // Delete
  static const String subirImagenProducto = '$_baseUrl/productos';      // Post

  // ====== CATEGORIAS ======
  static const String obtenerCategorias = '$_baseUrl/categorias';
  static const String obtenerClasificaciones = '$_baseUrl/categorias/clasificaciones';

  // ====== MOVIMIENTOS ======
  static const String obtenerMovimientos = '$_baseUrl/movimientos';
  static const String crearMovimiento = '$_baseUrl/movimientos';
  static const String resumenGeneral = '$_baseUrl/movimientos/resumen-general';
  static const String movimientosPorDia = '$_baseUrl/movimientos/por-dia';
  static const String movimientosPorTipo = '$_baseUrl/movimientos/por-tipo';
  static const String topProductos = '$_baseUrl/movimientos/top-productos';
  static const String resumenMensual = '$_baseUrl/movimientos/resumen-mensual';
  static const String movimientosTipo = '$_baseUrl/movimientos/tipo';  // /{tipo}
  static const String obtenerMovimiento = '$_baseUrl/movimientos';     // /{id}
  static const String actualizarMovimiento = '$_baseUrl/movimientos';  // /{id}
  static const String eliminarMovimiento = '$_baseUrl/movimientos';    // /{id}

  // ====== PEDIDOS ======
  static const String crearPedido = '$_baseUrl/pedidos/crear';
  static const String obtenerPedidos = '$_baseUrl/pedidos';
  static const String pedidosPorUsuario = '$_baseUrl/pedidos/usuario'; // /{id_usuario}
  static const String detallePedido = '$_baseUrl/pedidos/detalle';     // /{id_pedido}
  static const String actualizarPedido = '$_baseUrl/pedidos';          // /{id_pedido}
  static const String eliminarPedido = '$_baseUrl/pedidos';            // /{id_pedido}

  // ====== NOTIFICACIONES ======
  static const String obtenerNotificaciones = '$_baseUrl/notificaciones';
  static const String contarNotificaciones = '$_baseUrl/notificaciones/count';
  static const String notificacionesStockBajo = '$_baseUrl/notificaciones/stock-bajo';
  static const String notificacionesAgotados = '$_baseUrl/notificaciones/agotados';
  static const String notificacionesPedidosRecientes = '$_baseUrl/notificaciones/pedidos-recientes';
  static const String estadisticasNotificaciones = '$_baseUrl/notificaciones/estadisticas';

  // ====== PEDIDOS PERSONALIZADOS ======
  static const String obtenerMateriales = '$_baseUrl/pedidos-personalizados/materiales';
  static const String crearMaterial = '$_baseUrl/pedidos-personalizados/materiales';
  static const String materialesPorTipo = '$_baseUrl/pedidos-personalizados/materiales'; // /{tipo}
  static const String coloresMaterial = '$_baseUrl/pedidos-personalizados/materiales';   // /{id}/colores
  static const String disenosMaterial = '$_baseUrl/pedidos-personalizados/materiales';   // /{id}/disenos
  static const String actualizarMaterial = '$_baseUrl/pedidos-personalizados/materiales'; // /{id}
  static const String subirImagenMaterial = '$_baseUrl/pedidos-personalizados/materiales'; // /{id}/imagen
  static const String crearPedidoPersonalizado = '$_baseUrl/pedidos-personalizados';
  static const String obtenerPedidosPersonalizados = '$_baseUrl/pedidos-personalizados';
  static const String pedidosPersonalizadosPorUsuario = '$_baseUrl/pedidos-personalizados/usuario'; // /{id_usuario}
}