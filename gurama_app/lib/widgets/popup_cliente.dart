import 'package:flutter/material.dart';

class PopupCliente extends StatelessWidget {

  final VoidCallback onCerrar;

  const PopupCliente({
    super.key,
    required this.onCerrar,
  });

  @override
  Widget build(BuildContext context) {

    return Container(
      color: Colors.black54,

      child: Center(
        child: Container(
          width: 400,
          padding: const EdgeInsets.all(20),

          decoration: BoxDecoration(
            color: const Color(0xFFF8E2EF),
            borderRadius: BorderRadius.circular(20),
          ),

          child: Column(
            mainAxisSize: MainAxisSize.min,

            children: [

              Align(
                alignment: Alignment.topRight,

                child: IconButton(
                  onPressed: onCerrar,

                  icon: const Icon(Icons.close),
                ),
              ),

              const Text(
                "¡Bienvenido de nuevo a Gurama!",
                textAlign: TextAlign.center,

                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF7A235F),
                ),
              ),

              const SizedBox(height: 15),

              const Text(
                "Descubre las nuevas ofertas exclusivas solo para ti 💕",
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 10),

              Image.asset(
                'assets/images/1.png',
                height: 220,
                fit: BoxFit.cover,
              ),

              const SizedBox(height: 20),

              ElevatedButton(
                onPressed: () {},

                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color(0xFFC45A77),

                  shape: RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.circular(30),
                  ),
                ),

                child: const Text(
                  "Ver ofertas",
                  style: TextStyle(
                    color: Colors.white,
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