import 'package:flutter/material.dart';

import '../models/usuario.dart';
import 'admin_panel_page.dart';

class AdminCodePage extends StatefulWidget {

  final Usuario usuario;

  const AdminCodePage({
    super.key,
    required this.usuario,
  });

  @override
  State<AdminCodePage> createState() =>
      _AdminCodePageState();
}

class _AdminCodePageState
    extends State<AdminCodePage> {

  final TextEditingController codigoController =
      TextEditingController();

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFFAEDF4),

      appBar: AppBar(
        title: const Text(
          "Código Administrador",
        ),
      ),

      body: Center(
        child: Container(
          width: 350,
          padding: const EdgeInsets.all(25),

          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),

          child: Column(
            mainAxisSize: MainAxisSize.min,

            children: [

              const Text(
                "Verificación Admin",
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 25),

              TextField(
                controller: codigoController,

                decoration: InputDecoration(
                  labelText: "Código",

                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(15),
                  ),
                ),
              ),

              const SizedBox(height: 25),

              SizedBox(
                width: double.infinity,

                child: ElevatedButton(
                  onPressed: () {

                    if (codigoController.text ==
                        widget.usuario.codigo) {

                      Navigator.pushReplacement(
                        context,

                        MaterialPageRoute(
                          builder: (_) =>
                              const AdminPanelPage(),
                        ),
                      );

                    } else {

                      ScaffoldMessenger.of(context)
                          .showSnackBar(

                        const SnackBar(
                          content: Text(
                            "Código incorrecto",
                          ),
                        ),
                      );
                    }
                  },

                  child: const Text(
                    "Verificar",
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}