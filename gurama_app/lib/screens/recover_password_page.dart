import 'package:flutter/material.dart';

class RecoverPasswordPage extends StatefulWidget {
  const RecoverPasswordPage({super.key});

  @override
  State<RecoverPasswordPage> createState() =>
      _RecoverPasswordPageState();
}

class _RecoverPasswordPageState
    extends State<RecoverPasswordPage> {

  final TextEditingController correoController =
      TextEditingController();

  final TextEditingController codigoController =
      TextEditingController();

  void enviarCodigo() {
    final correo = correoController.text.trim();

    if (correo.isEmpty) {
      mostrarMensaje(
        'Ingrese un correo o teléfono',
      );
      return;
    }

    mostrarMensaje(
      'Código de recuperación enviado',
    );
  }

  void validarCodigo() {
    final codigo = codigoController.text.trim();

    if (codigo.isEmpty) {
      mostrarMensaje(
        'Ingrese el código de recuperación',
      );
      return;
    }

    Navigator.pushNamed(
      context,
      '/change-password',
    );
  }

  void mostrarMensaje(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(mensaje)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAEDF4),

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,

        title: Row(
          children: [
            Image.asset(
              'assets/images/Logo_GO.jpeg',
              height: 50,
            ),

            const Spacer(),

            TextButton(
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/login',
                );
              },
              child: const Text(
                'Iniciar sesión',
                style: TextStyle(
                  color: Color(0xFFC45A77),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const SizedBox(width: 10),

            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/register',
                );
              },

              style: ElevatedButton.styleFrom(
                backgroundColor:
                    const Color(0xFFC45A77),
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(25),
                ),
              ),

              child: const Text(
                'Registrarse',
                style: TextStyle(
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),

      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 350,
            margin: const EdgeInsets.all(20),
            padding: const EdgeInsets.all(25),

            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius:
                  BorderRadius.circular(15),

              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                ),
              ],
            ),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.stretch,

              children: [

                const Text(
                  'Recuperar Contraseña',
                  textAlign: TextAlign.center,

                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 25),

                const Text(
                  'Teléfono o correo electrónico',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 8),

                TextField(
                  controller: correoController,

                  decoration: InputDecoration(
                    hintText:
                        'Teléfono / Correo',

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),

                    focusedBorder:
                        OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide:
                          const BorderSide(
                        color:
                            Color(0xFFC45A77),
                        width: 2,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                ElevatedButton(
                  onPressed: enviarCodigo,

                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFFC45A77),

                    padding:
                        const EdgeInsets.symmetric(
                      vertical: 14,
                    ),

                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),

                  child: const Text(
                    'Enviar código de recuperación',
                    style: TextStyle(
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: 25),

                const Text(
                  'Código de recuperación',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 8),

                TextField(
                  controller: codigoController,

                  decoration: InputDecoration(
                    hintText: '— — — — — —',

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),

                    focusedBorder:
                        OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide:
                          const BorderSide(
                        color:
                            Color(0xFFC45A77),
                        width: 2,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                ElevatedButton(
                  onPressed: validarCodigo,

                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFF9B497D),

                    padding:
                        const EdgeInsets.symmetric(
                      vertical: 14,
                    ),

                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),

                  child: const Text(
                    'Cambiar contraseña',
                    style: TextStyle(
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(
                      context,
                      '/login',
                    );
                  },

                  child: const Text(
                    'Volver al inicio de sesión',
                    style: TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}