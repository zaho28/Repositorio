import 'package:flutter/material.dart';
import 'package:gurama_online/Data/Models/usuario_model.dart';
import 'package:gurama_online/Features/Auth-login/Login-Screen.dart';
import 'package:gurama_online/Features/Catalogo/Catalogo_Screen.dart';
import 'package:gurama_online/Features/Pedido_personalizado/PedidoPersonalizado_Screen.dart';
import 'package:provider/provider.dart';
import 'package:gurama_online/Provider/carrito_provider.dart';
import 'package:gurama_online/Features/Carrito/Carrito_Screen.dart';

class HomeScreen extends StatefulWidget {
  final UsuarioModel usuario;
  const HomeScreen({super.key, required this.usuario});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _indiceActual = 0;
  late final List<Widget> _pantallas;

  @override
  void initState() {
    super.initState();
    _pantallas = [
      _HomeContent(usuario: widget.usuario, onNavegar: _navegarA),
      CatalogoScreen(usuario: widget.usuario),
      PedidoPersonalizadoScreen(),
      _PerfilContent(usuario: widget.usuario),
    ];
  }

  void _navegarA(int indice) {
    setState(() => _indiceActual = indice);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _indiceActual, children: _pantallas),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFFc45a77),
        unselectedItemColor: const Color(0xFFd4a9c2),
        currentIndex: _indiceActual,
        type: BottomNavigationBarType.fixed,
        onTap: (indice) => setState(() => _indiceActual = indice),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined),         activeIcon: Icon(Icons.home),         label: 'Inicio'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_bag_outlined), activeIcon: Icon(Icons.shopping_bag), label: 'Catálogo'),
          BottomNavigationBarItem(icon: Icon(Icons.auto_fix_high_outlined),activeIcon: Icon(Icons.auto_fix_high),label: 'Personalizar'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),        activeIcon: Icon(Icons.person),       label: 'Perfil'),
        ],
      ),
    );
  }
}

// ── Contenido de la pagina de inicio ──────────────────────────────────────────
class _HomeContent extends StatelessWidget {
  final UsuarioModel usuario;
  final Function(int) onNavegar;
  const _HomeContent({required this.usuario, required this.onNavegar});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        backgroundColor: const Color(0xFFb4788b),
        automaticallyImplyLeading: false,
        title: Row(
          children: const [
            Text('Gurama',  style: TextStyle(color: Colors.white,          fontWeight: FontWeight.bold, fontSize: 22, fontStyle: FontStyle.italic)),
            Text('Online',  style: TextStyle(color: Color(0xFFf3e4e9),     fontWeight: FontWeight.w300, fontSize: 22, fontStyle: FontStyle.italic)),
          ],
        ),
        actions: [
          Consumer<CarritoProvider>(
            builder: (context, carrito, child) {
              return Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
                    onPressed: () => Navigator.push(context,
                        MaterialPageRoute(builder: (_) => const CarritoScreen())),
                  ),
                  if (carrito.totalProductos > 0)
                    Positioned(
                      right: 6, top: 6,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: Color(0xFF7a235f), shape: BoxShape.circle),
                        child: Text('${carrito.totalProductos}',
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ),
                ],
              );
            },
          ),
          IconButton(icon: const Icon(Icons.notifications_outlined, color: Colors.white), onPressed: () {}),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () => Navigator.pushAndRemoveUntil(context,
                MaterialPageRoute(builder: (_) => LoginScreen()), (route) => false),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30),
              decoration: const BoxDecoration(
                color: Color(0xFFb4788b),
                borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('¡Hola, ${usuario.nombreCompleto.split(' ').first}! ',
                      style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  const Text('Confecciones y pedidos hechos con amor ',
                      style: TextStyle(color: Color(0xFFf3e4e9), fontSize: 14)),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30)),
                    child: Row(
                      children: [
                        const Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Buscar productos...',
                              hintStyle: TextStyle(color: Color(0xFFd4a9c2)),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(color: Color(0xFFc45a77), shape: BoxShape.circle),
                          child: const Icon(Icons.search, color: Colors.white, size: 20),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 25),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text('Explorar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
            ),
            const SizedBox(height: 15),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(child: _tarjetaAcceso(icono: Icons.shopping_bag_outlined,  titulo: 'Catálogo',    subtitulo: 'Ver productos',    color: const Color(0xFFc45a77), onTap: () => onNavegar(1))),
                  const SizedBox(width: 15),
                  Expanded(child: _tarjetaAcceso(icono: Icons.auto_fix_high_outlined, titulo: 'Personalizar',subtitulo: 'Pedidos a medida', color: const Color(0xFF7a235f), onTap: () => onNavegar(2))),
                ],
              ),
            ),
            const SizedBox(height: 25),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text('Mis pedidos', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
            ),
            const SizedBox(height: 15),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Expanded(child: _tarjetaAcceso(icono: Icons.receipt_long_outlined,   titulo: 'Mis compras', subtitulo: 'Ver historial', color: const Color(0xFFb4788b), onTap: () {})),
                  const SizedBox(width: 15),
                  Expanded(child: _tarjetaAcceso(icono: Icons.shopping_cart_outlined,  titulo: 'Carrito',     subtitulo: 'Ver carrito',   color: const Color(0xFFd4a9c2), onTap: () {})),
                ],
              ),
            ),
            const SizedBox(height: 25),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                      colors: [Color(0xFFc45a77), Color(0xFF7a235f)],
                      begin: Alignment.centerLeft, end: Alignment.centerRight),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('¡Crea momentos especiales!',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                          SizedBox(height: 5),
                          Text('Amigurumis y sábanas\npersonalizadas ',
                              style: TextStyle(color: Color(0xFFf3e4e9), fontSize: 12)),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () => onNavegar(1),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white, foregroundColor: const Color(0xFFc45a77),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                      child: const Text('Ver todo', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _tarjetaAcceso({required IconData icono, required String titulo, required String subtitulo, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: color.withOpacity(0.2), blurRadius: 8, offset: const Offset(0, 3))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
              child: Icon(icono, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(titulo, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 14)),
            const SizedBox(height: 3),
            Text(subtitulo, style: const TextStyle(color: Color(0xFF5a3d54), fontSize: 11)),
          ],
        ),
      ),
    );
  }
}

// ── Contenido del perfil ───────────────────────────────────────────────────────
class _PerfilContent extends StatelessWidget {
  final UsuarioModel usuario;
  const _PerfilContent({required this.usuario});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf3e4e9),
      appBar: AppBar(
        backgroundColor: const Color(0xFFb4788b),
        automaticallyImplyLeading: false,
        title: const Text('Mi perfil', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            const CircleAvatar(
              radius: 50,
              backgroundColor: Color(0xFFc45a77),
              child: Icon(Icons.person, color: Colors.white, size: 50),
            ),
            const SizedBox(height: 15),
            Text(usuario.nombreCompleto,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF7a235f))),
            const SizedBox(height: 5),
            Text(usuario.correo, style: const TextStyle(color: Color(0xFF5a3d54))),
            const SizedBox(height: 30),
            _infoRow(Icons.phone_outlined,        'Teléfono',   usuario.telefono),
            const SizedBox(height: 10),
            _infoRow(Icons.badge_outlined,        'Documento',  '${usuario.tDoc}: ${usuario.idUsuario}'),
            const SizedBox(height: 10),
            _infoRow(Icons.check_circle_outline,  'Estado',     usuario.activo ? 'Cuenta activa' : 'Cuenta inactiva'),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFc45a77), size: 20),
          const SizedBox(width: 10),
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF5a3d54))),
          Expanded(child: Text(value,
              style: const TextStyle(color: Color(0xFF5a3d54)), overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }
}