import 'package:flutter/material.dart';

class Footer extends StatelessWidget {
  const Footer({super.key});

  @override
  Widget build(BuildContext context) {

    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.all(25),

      child: const Column(
        children: [

          Text(
            "Síguenos en nuestras redes sociales",
            style: TextStyle(
              color: Color(0xFF7A235F),
              fontWeight: FontWeight.bold,
            ),
          ),

          SizedBox(height: 10),

          Text("Instagram"),
          Text("TikTok"),

          SizedBox(height: 15),

          Text(
            "© Gurama 2025",
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}