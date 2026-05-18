import 'package:flutter/material.dart';
import '../widgets/header.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE8DADF),
      body: Column(
        children: [
          const Header(),

          Expanded(
            child: Center(
              child: Text("Página principal"),
            ),
          )
        ],
      ),
    );
  }
}