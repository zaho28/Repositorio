import 'package:flutter/material.dart';

import '../models/usuario.dart';

class CambiarDatosPage extends StatefulWidget {

  final Usuario usuario;

  const CambiarDatosPage({
    super.key,
    required this.usuario,
  });

  @override
  State<CambiarDatosPage> createState() =>
      _CambiarDatosPageState();
}

class _CambiarDatosPageState
    extends State<CambiarDatosPage> {

  late TextEditingController nombreController;
  late TextEditingController correoController;
  late TextEditingController telefonoController;
  late TextEditingController documentoController;

  @override
  void initState() {
    super.initState();

    nombreController =
        TextEditingController(
      text: widget.usuario.nombre,
    );

    correoController =
        TextEditingController(
      text: widget.usuario.correo,
    );

    telefonoController =
        TextEditingController(
      text: widget.usuario.telefono,
    );

    documentoController =
        TextEditingController(
      text: widget.usuario.documento,
    );
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor:
          const Color(0xFFE5C8D5),

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
            width: 500,
            margin: const EdgeInsets.all(20),
            padding: const EdgeInsets.all(35),

            decoration: BoxDecoration(
              color:
                  const Color(0xFFF8F2F5),

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

                Container(
                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 30,
                    vertical: 12,
                  ),

                  decoration: BoxDecoration(
                    color:
                        const Color(0xFF7B395C),

                    borderRadius:
                        BorderRadius.circular(30),
                  ),

                  child: const Text(
                    "Cambiar datos",

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),
                ),

                const SizedBox(height: 35),

                campo(
                  "Nombre de usuario",
                  nombreController,
                ),

                const SizedBox(height: 20),

                campo(
                  "Correo electrónico",
                  correoController,
                ),

                const SizedBox(height: 20),

                campo(
                  "Número telefónico",
                  telefonoController,
                ),

                const SizedBox(height: 20),

                Row(
                  children: [

                    Expanded(
                      child: campo(
                        "Tipo documento",

                        TextEditingController(
                          text:
                              "CC",
                        ),

                        enabled: false,
                      ),
                    ),

                    const SizedBox(width: 15),

                    Expanded(
                      child: campo(
                        "Documento",
                        documentoController,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 35),

                SizedBox(
                  width: 250,

                  child: ElevatedButton(
                    onPressed: () {

                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(

                        const SnackBar(
                          content: Text(
                            "Datos actualizados",
                          ),
                        ),
                      );

                      Navigator.pop(context);
                    },

                    style:
                        ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color(
                        0xFF7B395C,
                      ),

                      padding:
                          const EdgeInsets.symmetric(
                        vertical: 15,
                      ),

                      shape:
                          RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(
                          30,
                        ),
                      ),
                    ),

                    child: const Text(
                      "Guardar",

                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight:
                            FontWeight.bold,
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

  Widget campo(
    String label,
    TextEditingController controller, {
    bool enabled = true,
  }) {

    return TextField(
      controller: controller,
      enabled: enabled,

      decoration: InputDecoration(
        labelText: label,

        filled: true,
        fillColor: Colors.white,

        border: OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(30),
        ),

        enabledBorder:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(30),

          borderSide:
              const BorderSide(
            color: Color(0xFFD2A1BA),
            width: 2,
          ),
        ),

        focusedBorder:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(30),

          borderSide:
              const BorderSide(
            color: Color(0xFF7B395C),
            width: 2,
          ),
        ),
      ),
    );
  }
}