import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';
import '../../Shared/widgets/Custom_AppBar.dart';
import '../../Shared/widgets/Custom_Button.dart';
import '../../Shared/widgets/Custom_TextField.dart';
import '../../Shared/widgets/Custom_Sizedbox.dart';
import '../../Shared/constants/app_colors.dart';
import '../../Shared/providers/auth_provider.dart';
import '../../Shared/services/api_service.dart';
import '../../Shared/widgets/app_snackbar.dart';
import '../../core/network/network_info.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _correoController = TextEditingController();
  final TextEditingController _contrasenaController = TextEditingController();
  bool _loading = false;

  late final AuthRepositoryImpl _authRepo;

  @override
  void initState() {
    super.initState();
    _authRepo = AuthRepositoryImpl(
      networkInfo: NetworkInfoImpl(InternetConnection()),
    );
  }

  @override
  void dispose() {
    _correoController.dispose();
    _contrasenaController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final correo = _correoController.text.trim();
    final contrasena = _contrasenaController.text.trim();

    if (correo.isEmpty || contrasena.isEmpty) {
      AppSnackBar.warning(context, 'Por favor completa todos los campos');
      return;
    }

    setState(() => _loading = true);

    final result = await _authRepo.login(correo: correo, contrasena: contrasena);

    if (!mounted) return;
    setState(() => _loading = false);

    result.fold(
      (failure) => AppSnackBar.error(context, failure.message),

      (data) async {
        if (data['needs_code'] == true) {
          if (data['token'] != null) {
            await context.read<AuthProvider>().setToken(data['token']);
            ApiService.setToken(data['token']);
          }
          context.read<AuthProvider>().setUsuario(data['user']);
          Navigator.pushNamed(
            context,
            '/admin-code',
            arguments: {'id_usuario': data['user']['id_usuario'].toString()},
          );
        } else {
          await context.read<AuthProvider>().setToken(data['token']);
          ApiService.setToken(data['token']);
          context.read<AuthProvider>().setUsuario(data['user']);
          AppSnackBar.success(context, '¡Bienvenido a Gurama Online!');
        }
      },
    );
  } // 👈 Esta llave faltaba — cierra _login()

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: 'Gurama Online'),
      body: Container(
        color: AppColors.blanco,
        child: Center(
          child: SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 30, vertical: 40),
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: AppColors.blanco,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withValues(alpha: 0.2),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset('lib/Assest/Logo_GO.jpeg', height: 80),
                  AppSpaces.verticalLarge,
                  const Text(
                    'Iniciar Sesión',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.secundario,
                    ),
                  ),
                  AppSpaces.verticalLarge,
                  CustomTextField(
                    label: 'Correo electrónico',
                    icon: Icons.email,
                    controller: _correoController,
                  ),
                  AppSpaces.verticalMedium,
                  CustomTextField(
                    label: 'Contraseña',
                    icon: Icons.lock,
                    controller: _contrasenaController,
                    isPassword: true,
                  ),
                  AppSpaces.verticalinter,
                  _loading
                      ? const SizedBox(
                          height: 48,
                          child: Center(
                            child: CircularProgressIndicator(
                              color: AppColors.primario,
                              strokeWidth: 2.5,
                            ),
                          ),
                        )
                      : CustomButton(
                          text: 'INGRESAR',
                          onPressed: _login,
                        ),
                  AppSpaces.verticalMedium,
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('¿No tiene cuenta?'),
                      TextButton(
                        onPressed: () {
                          // Navigator.pushNamed(context, '/registro');
                        },
                        child: const Text(
                          'Registrarse',
                          style: TextStyle(
                            color: AppColors.primario,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      // Navigator.pushNamed(context, '/olvide_c');
                    },
                    child: const Text(
                      '¿Olvidó su contraseña?',
                      style: TextStyle(color: AppColors.primario),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}