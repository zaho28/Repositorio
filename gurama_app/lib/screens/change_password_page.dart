import 'package:flutter/material.dart';

class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() =>
      _ChangePasswordPageState();
}

class _ChangePasswordPageState
    extends State<ChangePasswordPage> {

  final TextEditingController nuevaController =
      TextEditingController();

  final TextEditingController confirmarController =
      TextEditingController();

  bool cargando = false;

  void cambiarContrasena() {

    final nueva =
        nuevaController.text.trim();

    final confirmar =
        confirmarController.text.trim();

    if (nueva.isEmpty ||
        confirmar.isEmpty) {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        const SnackBar(
          content: Text(
            "Complete todos los campos",
          ),
        ),
      );

      return;
    }

    if (nueva != confirmar) {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        const SnackBar(
          content: Text(
            "Las contraseñas no coinciden",
          ),
        ),
      );

      return;
    }

    ScaffoldMessenger.of(context)
        .showSnackBar(

      const SnackBar(
        content: Text(
          "Contraseña actualizada correctamente",
        ),
      ),
    );

    Navigator.pushReplacementNamed(
      context,
      '/login',
    );
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor:
          const Color(0xFFFAEDF4),

      appBar: AppBar(
        backgroundColor: Colors.white,

        title: Row(
          children: [

            Image.asset(
              'assets/images/Logo_GO.jpeg',
              height: 50,
            ),

            const Spacer(),

            TextButton(
              onPressed: () {
                Navigator.pushReplacementNamed(
                  context,
                  '/login',
                );
              },

              child: const Text(
                "Iniciar sesión",
              ),
            ),
          ],
        ),
      ),

      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 380,
            margin:
                const EdgeInsets.all(20),

            padding:
                const EdgeInsets.all(25),

            decoration: BoxDecoration(
              color: Colors.white,

              borderRadius:
                  BorderRadius.circular(20),

              boxShadow: [
                BoxShadow(
                  color:
                      Colors.black.withOpacity(0.1),

                  blurRadius: 10,
                ),
              ],
            ),

            child: Column(
              mainAxisSize: MainAxisSize.min,

              children: [

                const Text(
                  "Cambiar contraseña",

                  style: TextStyle(
                    fontSize: 28,
                    fontWeight:
                        FontWeight.bold,

                    color:
                        Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 30),

                TextField(
                  controller:
                      nuevaController,

                  obscureText: true,

                  decoration: InputDecoration(
                    labelText:
                        "Nueva contraseña",

                    border:
                        OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                TextField(
                  controller:
                      confirmarController,

                  obscureText: true,

                  decoration: InputDecoration(
                    labelText:
                        "Confirmar contraseña",

                    border:
                        OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                SizedBox(
                  width: double.infinity,

                  child: ElevatedButton(
                    onPressed:
                        cargando
                            ? null
                            : cambiarContrasena,

                    style:
                        ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color(
                              0xFFC45A77),

                      padding:
                          const EdgeInsets.symmetric(
                        vertical: 15,
                      ),
                    ),

                    child: const Text(
                      "Guardar cambios",
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