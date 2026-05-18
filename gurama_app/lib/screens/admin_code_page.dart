import 'package:flutter/material.dart';
import '../models/usuario.dart';

class AdminCodePage extends StatefulWidget {
  final Usuario usuario;

  const AdminCodePage({
    super.key,
    required this.usuario,
  });

  @override
  State<AdminCodePage> createState() => _AdminCodePageState();
}

class _AdminCodePageState extends State<AdminCodePage> {
  final TextEditingController codigoController = TextEditingController();

  void verificarCodigo() {
    final codigoIngresado = codigoController.text.trim();

    if (codigoIngresado.isEmpty) {
      mostrarMensaje('Ingrese el código de administrador');
      return;
    }

    if (codigoIngresado == widget.usuario.codigo.toString()) {
      mostrarMensaje(
        'Bienvenido Administrador ${widget.usuario.nombre}',
      );

      Navigator.pushReplacementNamed(
        context,
        '/admin-panel',
      );
    } else {
      mostrarMensaje('Código incorrecto');
    }
  }

  void mostrarMensaje(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(mensaje)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE7CDD7),

      body: Column(
        children: [

          // HEADER
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 30,
              vertical: 20,
            ),

            color: Colors.white,

            child: SafeArea(
              child: Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,

                children: [

                  // LOGO
                  Image.asset(
                    'assets/images/Gurama_Logo.jpeg',
                    height: 80,
                  ),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color(0xFFC45A77),

                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(25),
                      ),

                      padding:
                          const EdgeInsets.symmetric(
                        horizontal: 25,
                        vertical: 12,
                      ),
                    ),

                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        '/register',
                      );
                    },

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
          ),

          // CONTENIDO
          Expanded(
            child: Center(
              child: Container(
                width: 380,
                padding: const EdgeInsets.all(35),

                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(15),

                  boxShadow: [
                    BoxShadow(
                      blurRadius: 15,
                      color: Colors.black.withOpacity(0.2),
                    ),
                  ],
                ),

                child: Column(
                  mainAxisSize: MainAxisSize.min,

                  children: [

                    const Text(
                      'Iniciar sesión',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF7D2B46),
                      ),
                    ),

                    const SizedBox(height: 20),

                    const Text(
                      'Estas ingresando como administrador, para continuar ingrese su código',
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 25),

                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Código de administrador',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    TextField(
                      controller: codigoController,

                      obscureText: true,

                      decoration: InputDecoration(
                        hintText:
                            'Ingresa tu código',

                        border: OutlineInputBorder(
                          borderRadius:
                              BorderRadius.circular(8),
                        ),
                      ),
                    ),

                    const SizedBox(height: 25),

                    SizedBox(
                      width: double.infinity,

                      child: ElevatedButton(
                        style:
                            ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color(0xFFC45A77),

                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 14,
                          ),

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(25),
                          ),
                        ),

                        onPressed: verificarCodigo,

                        child: const Text(
                          'Ingresar',
                          style: TextStyle(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),

                    SizedBox(
                      width: double.infinity,

                      child: ElevatedButton(
                        style:
                            ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
                          padding:
                              const EdgeInsets.symmetric(
                            vertical: 14,
                          ),

                          shape:
                              RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(25),
                          ),
                        ),

                        onPressed: () {
                          Navigator.pop(context);
                        },

                        child: const Text(
                          'Volver',
                          style: TextStyle(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}