import 'package:flutter/material.dart';

class ProductoDetallePage extends StatelessWidget {

  final String nombre;
  final String descripcion;
  final String precio;
  final String imagen;

  const ProductoDetallePage({
    super.key,
    required this.nombre,
    required this.descripcion,
    required this.precio,
    required this.imagen,
  });

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

              child: const Text(
                "Volver",
                style: TextStyle(
                  color: Color(0xFFC45A77),
                ),
              ),
            ),
          ],
        ),
      ),

      body: Center(
        child: SingleChildScrollView(

          child: Container(
            constraints: const BoxConstraints(
              maxWidth: 900,
            ),

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

            child: LayoutBuilder(
              builder: (context, constraints) {

                bool movil =
                    constraints.maxWidth < 700;

                return Flex(

                  direction:
                      movil
                          ? Axis.vertical
                          : Axis.horizontal,

                  crossAxisAlignment:
                      CrossAxisAlignment.center,

                  children: [

                    /// IMAGEN
                    Expanded(
                      flex: 1,

                      child: ClipRRect(
                        borderRadius:
                            BorderRadius.circular(15),

                        child: Image.asset(
                          imagen,

                          height:
                              movil ? 300 : 400,

                          fit: BoxFit.cover,
                        ),
                      ),
                    ),

                    SizedBox(
                      width: movil ? 0 : 30,
                      height: movil ? 30 : 0,
                    ),

                    /// INFO
                    Expanded(
                      flex: 1,

                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,

                        children: [

                          Text(
                            nombre,

                            style: const TextStyle(
                              fontSize: 30,
                              fontWeight:
                                  FontWeight.bold,

                              color:
                                  Color(0xFF7A235F),
                            ),
                          ),

                          const SizedBox(height: 20),

                          Text(
                            descripcion,

                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.black87,
                              height: 1.5,
                            ),
                          ),

                          const SizedBox(height: 25),

                          Text(
                            precio,

                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight:
                                  FontWeight.bold,

                              color:
                                  Color(0xFFE91E63),
                            ),
                          ),

                          const SizedBox(height: 30),

                          SizedBox(
                            width: double.infinity,

                            child: ElevatedButton.icon(

                              onPressed: () {

                                Navigator.pushNamed(
                                  context,
                                  '/login',
                                );
                              },

                              icon: const Icon(
                                Icons.shopping_cart,
                              ),

                              label: const Text(
                                "Agregar al carrito",
                              ),

                              style:
                                  ElevatedButton.styleFrom(

                                backgroundColor:
                                    const Color(
                                      0xFFFF69B4,
                                    ),

                                foregroundColor:
                                    Colors.white,

                                padding:
                                    const EdgeInsets.symmetric(
                                  vertical: 15,
                                ),

                                shape:
                                    RoundedRectangleBorder(

                                  borderRadius:
                                      BorderRadius.circular(
                                    12,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}