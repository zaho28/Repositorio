import 'package:flutter/material.dart';

import '../widgets/footer.dart';
import '../widgets/popup_cliente.dart';

class ClientePage extends StatefulWidget {
  const ClientePage({super.key});

  @override
  State<ClientePage> createState() => _ClientePageState();
}

class _ClientePageState extends State<ClientePage> {

  bool mostrarPopup = true;

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Colors.white,

      appBar: AppBar(
        backgroundColor: const Color(0xFFE6E6E6),
        elevation: 2,

        title: Row(
          children: [

            Image.asset(
              'assets/images/Logo_GO.jpeg',
              height: 60,
            ),

            const Spacer(),

            TextButton(
              onPressed: () {},
              child: const Text("Inicio"),
            ),

            TextButton(
              onPressed: () {},
              child: const Text("Catálogo"),
            ),

            TextButton(
              onPressed: () {},
              child: const Text("Pedido personalizado"),
            ),

            TextButton(
              onPressed: () {},
              child: const Text("Cerrar sesión"),
            ),

            const SizedBox(width: 15),

            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.shopping_cart),
            ),

            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.person),
            ),
          ],
        ),
      ),

      body: Stack(
        children: [

          SingleChildScrollView(
            child: Column(
              children: [

                const SizedBox(height: 30),

                // BUSCADOR

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [

                    Container(
                      width: 400,

                      decoration: BoxDecoration(
                        border: Border.all(
                          color: const Color(0xFFD4A9C2),
                          width: 2,
                        ),

                        borderRadius: BorderRadius.circular(30),
                      ),

                      child: const TextField(
                        decoration: InputDecoration(
                          hintText: "Buscar productos...",
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 10),

                    ElevatedButton(
                      onPressed: () {},

                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFC45A77),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),

                        padding: const EdgeInsets.all(15),
                      ),

                      child: const Icon(
                        Icons.search,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 40),

                // HERO

                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(30),

                  decoration: BoxDecoration(
                    color: const Color(0xFFB4788C),
                    borderRadius: BorderRadius.circular(20),
                  ),

                  child: Row(
                    children: [

                      Expanded(
                        flex: 2,

                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.center,

                          children: [

                            const Text(
                              "Gurama",
                              style: TextStyle(
                                fontSize: 45,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Serif',
                              ),
                            ),

                            const SizedBox(height: 10),

                            const Text(
                              "Confecciones y pedidos",
                              style: TextStyle(
                                fontSize: 24,
                                color: Colors.white,
                              ),
                            ),

                            const SizedBox(height: 20),

                            const Text(
                              "¡Crea momentos especiales con nuestros\namigurumis y sábanas personalizadas!",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(width: 30),

                      Expanded(
                        child: ClipRRect(
                          borderRadius:
                              BorderRadius.circular(15),

                          child: Image.asset(
                            'assets/images/2.png',
                            height: 320,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // PROMOCIÓN

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    vertical: 40,
                    horizontal: 20,
                  ),

                  decoration: const BoxDecoration(
                    color: Color(0xFFF7F7F7),

                    border: Border(
                      top: BorderSide(
                        color: Color(0xFFD4A9C2),
                        width: 3,
                      ),

                      bottom: BorderSide(
                        color: Color(0xFFD4A9C2),
                        width: 3,
                      ),
                    ),
                  ),

                  child: Column(
                    children: [

                      const Text(
                        "Sorprende a tus seres queridos con regalos únicos y hechos con amor",
                        textAlign: TextAlign.center,

                        style: TextStyle(
                          fontSize: 20,
                          color: Color(0xFF5A3D54),
                        ),
                      ),

                      const SizedBox(height: 20),

                      ElevatedButton(
                        onPressed: () {},

                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              const Color(0xFFC45A77),

                          padding: const EdgeInsets.symmetric(
                            horizontal: 30,
                            vertical: 18,
                          ),

                          shape: RoundedRectangleBorder(
                            borderRadius:
                                BorderRadius.circular(30),
                          ),
                        ),

                        child: const Text(
                          "Explora nuestro catálogo",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 50),

                const Footer(),
              ],
            ),
          ),

          // POPUP

          if (mostrarPopup)

            PopupCliente(
              onCerrar: () {

                setState(() {
                  mostrarPopup = false;
                });
              },
            ),
        ],
      ),
    );
  }
}