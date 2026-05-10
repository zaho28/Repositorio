import 'package:flutter/material.dart';

import '../models/usuario.dart';
import '../services/auth_service.dart';
import 'admin_code_page.dart';
import 'cliente_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() =>
      _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  final TextEditingController correoController =
      TextEditingController();

  final TextEditingController contrasenaController =
      TextEditingController();

  bool cargando = false;

  Future<void> iniciarSesion() async {

    final correo =
        correoController.text.trim();

    final contrasena =
        contrasenaController.text.trim();

    if (correo.isEmpty ||
        contrasena.isEmpty) {

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

    setState(() {
      cargando = true;
    });

    final Usuario? usuario =
        await AuthService.login(
      correo,
      contrasena,
    );

    setState(() {
      cargando = false;
    });

    if (usuario == null) {

      ScaffoldMessenger.of(context)
          .showSnackBar(

        const SnackBar(
          content: Text(
            "Correo o contraseña incorrectos",
          ),
        ),
      );

      return;
    }

    // ADMIN
    if (usuario.rol == 'admin') {

      Navigator.push(
        context,

        MaterialPageRoute(
          builder: (_) =>
              AdminCodePage(
            usuario: usuario,
          ),
        ),
      );

    } else {

      // CLIENTE
      Navigator.pushReplacement(
        context,

        MaterialPageRoute(
          builder: (_) =>
              const ClientePage(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFFAEDF4),

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
                Navigator.pop(context);
              },

              child: const Text("Volver"),
            ),
          ],
        ),
      ),

      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 380,
            margin: const EdgeInsets.all(20),
            padding: const EdgeInsets.all(25),

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
                  "Iniciar sesión",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 30),

                TextField(
                  controller: correoController,

                  decoration: InputDecoration(
                    labelText:
                        "Correo electrónico",

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                TextField(
                  controller:
                      contrasenaController,

                  obscureText: true,

                  decoration: InputDecoration(
                    labelText: "Contraseña",

                    border: OutlineInputBorder(
                      borderRadius:
                          BorderRadius.circular(18),
                    ),
                  ),
                ),

                const SizedBox(height: 25),

                SizedBox(
                  width: double.infinity,

                  child: ElevatedButton(
                    onPressed:
                        cargando
                            ? null
                            : iniciarSesion,

                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color(0xFFC45A77),

                      padding:
                          const EdgeInsets.symmetric(
                        vertical: 15,
                      ),
                    ),

                    child:
                        cargando
                            ? const CircularProgressIndicator()
                            : const Text(
                                "Ingresar",
                              ),
                  ),
                ),

                const SizedBox(height: 20),

                Row(
                  mainAxisAlignment:
                      MainAxisAlignment.center,

                  children: [

                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/register');
                      },

                      child: const Text(
                        "¿No tienes cuenta?",
                      ),
                    ),

                    TextButton(
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                           '/recover-password',
                           );
                      },

                      child: const Text(
                        "¿Olvidó su contraseña?",
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}