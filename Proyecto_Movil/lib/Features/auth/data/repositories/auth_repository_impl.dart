import 'dart:convert';
import 'package:fpdart/fpdart.dart';
import 'package:http/http.dart' as http;
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../Shared/constants/app_constants.dart';
import '../../domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({required this.networkInfo});

  @override
  Future<Either<Failure, Map<String, dynamic>>> login({
    required String correo,
    required String contrasena,
  }) async {
    // safeCall envuelve TODO: sin internet, timeout, JSON inválido, errores inesperados
    final result = await safeCall<http.Response>(
      () => http
          .post(
            Uri.parse(AppConstants.login),
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': AppConstants.apiKey,
            },
            body: jsonEncode({
              'correo': correo,
              'contrasena': contrasena,
            }),
          )
          .timeout(const Duration(seconds: 15)),
      networkInfo: networkInfo,
    );

    // Si safeCall retornó un Failure (conexión / excepción), lo propagamos
    return result.flatMap((response) {
      try {
        final data = jsonDecode(response.body) as Map<String, dynamic>;

        if (response.statusCode == 200 || response.statusCode == 201) {
          return right(data);
        }

        // El servidor respondió con un código de error HTTP
        final msg = data['message']?.toString() ?? 'Correo o contraseña incorrectos';
        return left(ServerFailure(msg));
      } on FormatException {
        return left(const ServerFailure('Respuesta inválida del servidor'));
      }
    });
  }
}
