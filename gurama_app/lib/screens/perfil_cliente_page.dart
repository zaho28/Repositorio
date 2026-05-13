import 'package:flutter/material.dart';

import '../models/usuario.dart';
import 'login_page.dart';

class PerfilClientePage extends StatelessWidget {

  final Usuario usuario;

  const PerfilClientePage({
    super.key,
    required this.usuario,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFF7E8EE),

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

              child: const Text(
                "Volver",
              ),
            ),
          ],
        ),
      ),

      body: Center(
        child: SingleChildScrollView(

          child: Container(
            width: 650,

            margin: const EdgeInsets.all(20),

            padding: const EdgeInsets.all(30),

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
              children: [

                const Text(
                  "Perfil",

                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 30),

                Row(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,

                  children: [

                    Expanded(
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,

                        children: [

                          dato(
                            "Nombre de usuario",
                            usuario.nombre,
                          ),

                          dato(
                            "Correo electrónico",
                            usuario.correo,
                          ),

                          dato(
                            "Número telefónico",
                            usuario.telefono,
                          ),

                          dato(
                            "Rol",
                            usuario.rol,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(width: 30),

                    Column(
                      children: [

                        CircleAvatar(
                          radius: 70,

                          backgroundColor:
                              const Color(0xFFC45A77),

                          child: const Icon(
                            Icons.person,
                            size: 80,
                            color: Colors.white,
                          ),
                        ),

                        const SizedBox(height: 10),

                        Text(
                          usuario.rol,

                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 40),

                Row(
                  children: [

                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {

                          Navigator.pushNamed(
                            context,
                            '/editar-datos',
                          );
                        },

                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color(0xFFC45A77),

                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 15,
                          ),
                        ),

                        child: const Text(
                          "Cambiar datos",
                        ),
                      ),
                    ),

                    const SizedBox(width: 20),

                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {

                          Navigator.pushNamed(
                            context,
                            '/change-password',
                          );
                        },

                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color(0xFFC45A77),

                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 15,
                          ),
                        ),

                        child: const Text(
                          "Cambiar contraseña",
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                SizedBox(
                  width: double.infinity,

                  child: ElevatedButton(
                    onPressed: () {

                      Navigator.pushAndRemoveUntil(
                        context,

                        MaterialPageRoute(
                          builder: (_) =>
                              const LoginPage(),
                        ),

                        (route) => false,
                      );
                    },

                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color(0xFF6B5B6E),

                      padding:
                          const EdgeInsets.symmetric(
                        vertical: 15,
                      ),
                    ),

                    child: const Text(
                      "Cerrar sesión",
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

  Widget dato(
    String titulo,
    String valor,
  ) {

    return Padding(
      padding: const EdgeInsets.only(
        bottom: 20,
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          Text(
            titulo,

            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.black54,
            ),
          ),

          const SizedBox(height: 5),

          Text(
            valor,

            style: const TextStyle(
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}