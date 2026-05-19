import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'data/models/usuario_model.dart';
import 'data/models/producto_model.dart';
import 'Features/index.dart';
import 'Shared/providers/auth_provider.dart';
import 'Shared/providers/producto_provider.dart';

void main() {
  runApp(const GuramaApp());
}

class GuramaApp extends StatelessWidget {
  const GuramaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ProductoProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Gurama Online',
        initialRoute: '/login',
        routes: _buildRoutes(),
      ),
    );
  }

  Map<String, WidgetBuilder> _buildRoutes() {
    return {
      '/login': (context) => LoginScreen(),
      '/admin-code': (context) {
        final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
        return LoginAdminCodeScreen(idUsuario: args['id_usuario'].toString());
      },
      '/admin/panel': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return PanelControlScreen(usuario: u);
      },
      '/admin/productos': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return ProductosScreen(usuario: u);
      },
      '/admin/materiales': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return MaterialesScreen(usuario: u);
      },
      '/admin/movimientos': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return MovimientosScreen(usuario: u);
      },
      '/admin/pedidos': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return PedidosRealizadosScreen(usuario: u);
      },
      '/admin/reportes': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return ReportesScreen(usuario: u);
      },
      '/admin/historial': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return HistorialVentasScreen(usuario: u);
      },
      '/admin/notificaciones': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return NotificacionesScreen(usuario: u);
      },
      '/admin/usuarios': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return GestionUsuariosScreen(usuario: u);
      },
      '/admin/editar-producto': (context) {
        final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
        return EditarProductoScreen(
          producto: args['producto'] as ProductoModel,
          usuario:  args['usuario'] as UsuarioModel,
        );
      },
      '/admin/registro-producto': (context) {
        final u = ModalRoute.of(context)!.settings.arguments as UsuarioModel;
        return RegistroProductoScreen(usuario: u);
      },
      '/entradas': (context) => const EntradasScreen(),
      '/salidas': (context) => const SalidasScreen(),
      '/perfil': (context) => const PerfilAdminScreen(),
      '/cambiar-datos': (context) => const CambiarDatosScreen(),
      '/cambiar-contrasena': (context) => const CambiarContrasenaScreen(),
    };
  }
}
/*
  // debemos agregar on generate para que vaya a home si no existe
  // Helper para leer argumentos de navegación
  static Map<String, dynamic> _getArgs(BuildContext context) {
    return ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
  }
}*/