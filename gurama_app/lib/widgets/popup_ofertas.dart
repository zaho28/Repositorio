import 'package:flutter/material.dart';

class PopupOfertas extends StatelessWidget {

  final VoidCallback onCerrar;

  const PopupOfertas({
    super.key,
    required this.onCerrar,
  });

  @override
  Widget build(BuildContext context) {

    return Container(
      color: Colors.black.withOpacity(0.5),

      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),

          decoration: BoxDecoration(
            color: const Color(0xFFF3D4E5),
            borderRadius: BorderRadius.circular(20),
          ),

          child: Column(
            mainAxisSize: MainAxisSize.min,

            children: [

              Align(
                alignment: Alignment.topRight,

                child: IconButton(
                  icon: const Icon(Icons.close),

                  onPressed: onCerrar,
                ),
              ),

              const Text(
                "¡Descubre nuestras ofertas!",
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 15),

              Image.asset(
                'assets/images/1.png',
                height: 200,
              ),

              const SizedBox(height: 15),

              ElevatedButton(
                onPressed: () {},

                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFC45A77),
                ),

                child: const Text("Ver ofertas"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}