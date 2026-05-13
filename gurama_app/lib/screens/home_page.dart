import 'package:flutter/material.dart';
import 'package:gurama_app/screens/register_page.dart';

import '../models/producto.dart';
import '../widgets/footer.dart';
import '../widgets/popup_ofertas.dart';
import '../widgets/producto_card.dart';
import 'login_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  bool mostrarVentana = true;

  final List<Producto> productos = [

    Producto(
      id: 1,
      imagen: 'assets/images/1.png',
      nombre: 'Virgencitas de crochet',
    ),

    Producto(
      id: 2,
      imagen: 'assets/images/2.png',
      nombre: 'Ramo de tulipanes tejidos',
    ),

    Producto(
      id: 3,
      imagen: 'assets/images/3.png',
      nombre: 'Cubrelecho español',
    ),

    Producto(
      id: 4,
      imagen: 'assets/images/4.png',
      nombre: 'Amigurumi Stitch',
    ),
  ];

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
              onPressed: () {},
              child: const Text("Inicio"),
            ),

            TextButton(
              onPressed: () {

                Navigator.push(
                  context,

                  MaterialPageRoute(
                    builder: (_) => const LoginPage(),
                  ),
                );
              },

              child: const Text("Iniciar sesión"),
            ),

            TextButton(
              onPressed: () {
                
                Navigator.push(
                  context,
                  
                  MaterialPageRoute(
                    builder: (_) => const RegisterPage(),
                  ),
                );
              },
            
              child: const Text("Registrarse"),
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

                Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 20),

                  padding: const EdgeInsets.all(25),

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
                              CrossAxisAlignment.start,

                          children: [

                            const Text(
                              "Gurama",
                              style: TextStyle(
                                fontSize: 38,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),

                            const SizedBox(height: 10),

                            const Text(
                              "Confecciones y pedidos",
                              style: TextStyle(
                                fontSize: 22,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(width: 20),

                      Expanded(
                        child: ClipRRect(
                          borderRadius:
                              BorderRadius.circular(15),

                          child: Image.asset(
                            'assets/images/2.png',
                            height: 300,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                const Text(
                  "Catálogo",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF7A235F),
                  ),
                ),

                const SizedBox(height: 25),

                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20),

                  child: GridView.builder(
                    shrinkWrap: true,

                    physics:
                        const NeverScrollableScrollPhysics(),

                    itemCount: productos.length,

                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 20,
                      mainAxisSpacing: 20,
                      childAspectRatio: 0.72,
                    ),

                    itemBuilder: (context, index) {

                      return ProductoCard(
                        producto: productos[index],
                      );
                    },
                  ),
                ),

                const SizedBox(height: 40),

                const Footer(),
              ],
            ),
          ),

          if (mostrarVentana)

            PopupOfertas(
              onCerrar: () {

                setState(() {
                  mostrarVentana = false;
                });
              },
            ),
        ],
      ),
    );
  }
}