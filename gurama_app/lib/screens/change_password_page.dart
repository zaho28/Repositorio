import 'package:flutter/material.dart';

import 'login_page.dart';

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

  bool ocultarNueva = true;
  bool ocultarConfirmar = true;

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

                Navigator.pushReplacement(
                  context,

                  MaterialPageRoute(
                    builder: (_) => const LoginPage(),
                  ),
                );
              },

              child: const Text(
                "Iniciar sesión",
                style: TextStyle(
                  color: Color(0xFF7A235F),
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
            padding: const EdgeInsets.all(25),

            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),

              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                const Text(
                  "Cambiar contraseña",

                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 25),

                const Text(
                  "Nueva contraseña",

                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF5A3D54),
                  ),
                ),

                const SizedBox(height: 8),

                TextField(
                  controller: nuevaController,
                  obscureText: ocultarNueva,

                  decoration: InputDecoration(
                    hintText:
                        "Ingresa tu nueva contraseña",

                    filled: true,
                    fillColor: Colors.white,

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFD4A9C2),
                      ),
                    ),

                    enabledBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFD4A9C2),
                        width: 2,
                      ),
                    ),

                    focusedBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFC45A77),
                        width: 2,
                      ),
                    ),

                    suffixIcon: IconButton(
                      icon: Icon(
                        ocultarNueva
                            ? Icons.visibility_off
                            : Icons.visibility,
                      ),

                      onPressed: () {

                        setState(() {
                          ocultarNueva =
                              !ocultarNueva;
                        });
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                const Text(
                  "Confirmar contraseña",

                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF5A3D54),
                  ),
                ),

                const SizedBox(height: 8),

                TextField(
                  controller: confirmarController,
                  obscureText: ocultarConfirmar,

                  decoration: InputDecoration(
                    hintText:
                        "Confirma tu nueva contraseña",

                    filled: true,
                    fillColor: Colors.white,

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFD4A9C2),
                      ),
                    ),

                    enabledBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFD4A9C2),
                        width: 2,
                      ),
                    ),

                    focusedBorder: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),

                      borderSide: const BorderSide(
                        color: Color(0xFFC45A77),
                        width: 2,
                      ),
                    ),

                    suffixIcon: IconButton(
                      icon: Icon(
                        ocultarConfirmar
                            ? Icons.visibility_off
                            : Icons.visibility,
                      ),

                      onPressed: () {

                        setState(() {
                          ocultarConfirmar =
                              !ocultarConfirmar;
                        });
                      },
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                SizedBox(
                  width: double.infinity,

                  child: ElevatedButton(
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

                    onPressed: () {

                      if (nuevaController.text !=
                          confirmarController.text) {

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

                      Navigator.pushReplacement(
                        context,

                        MaterialPageRoute(
                          builder: (_) =>
                              const LoginPage(),
                        ),
                      );
                    },

                    child: const Text(
                      "Guardar cambios",

                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
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