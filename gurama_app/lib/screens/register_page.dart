import 'package:flutter/material.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {

  final _formKey = GlobalKey<FormState>();

  final nombreController = TextEditingController();
  final correoController = TextEditingController();
  final telefonoController = TextEditingController();
  final documentoController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  String tipoDocumento = '';

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: const Color(0xFFFAEDF4),

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 2,

        title: Row(
          children: [

            Image.asset(
              'assets/images/Logo_GO.jpeg',
              height: 50,
            ),

            const SizedBox(width: 10),

            const Text(
              'Registrarse',
              style: TextStyle(
                color: Color(0xFF7A235F),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),

        actions: [

          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },

            child: const Text(
              'Volver',
              style: TextStyle(
                color: Color(0xFFC45A77),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          TextButton(
            onPressed: () {
              Navigator.pushNamed(context, '/login');
            },

            child: const Text(
              'Iniciar sesión',
              style: TextStyle(
                color: Color(0xFFC45A77),
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),

      body: Center(
        child: SingleChildScrollView(

          child: Container(
            width: 350,
            margin: const EdgeInsets.all(20),
            padding: const EdgeInsets.all(25),

            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),

              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                ),
              ],
            ),

            child: Form(
              key: _formKey,

              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [

                  const Text(
                    'Registrarse',
                    textAlign: TextAlign.center,

                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF7A235F),
                    ),
                  ),

                  const SizedBox(height: 25),

                  // NOMBRE
                  TextFormField(
                    controller: nombreController,

                    decoration: InputDecoration(
                      hintText: 'Ingrese su nombre completo',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),

                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Ingrese su nombre';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 15),

                  // CORREO
                  TextFormField(
                    controller: correoController,
                    keyboardType: TextInputType.emailAddress,

                    decoration: InputDecoration(
                      hintText: 'Ingrese su correo electrónico',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),

                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Ingrese su correo';
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 15),

                  // TELEFONO
                  TextFormField(
                    controller: telefonoController,
                    keyboardType: TextInputType.phone,

                    decoration: InputDecoration(
                      hintText: 'Ingrese su número telefónico',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  // TIPO DOCUMENTO
                  DropdownButtonFormField<String>(

                    initialValue: tipoDocumento.isEmpty
                        ? null
                        : tipoDocumento,

                    decoration: InputDecoration(

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),

                    hint: const Text(
                      'Seleccione su tipo de documento',
                    ),

                    items: const [

                      DropdownMenuItem(
                        value: 'CC',
                        child: Text('Cédula de ciudadanía'),
                      ),

                      DropdownMenuItem(
                        value: 'CE',
                        child: Text('Cédula de extranjería'),
                      ),

                      DropdownMenuItem(
                        value: 'TI',
                        child: Text('Tarjeta de identidad'),
                      ),
                    ],

                    onChanged: (value) {
                      setState(() {
                        tipoDocumento = value!;
                      });
                    },
                  ),

                  const SizedBox(height: 15),

                  // DOCUMENTO
                  TextFormField(
                    controller: documentoController,
                    keyboardType: TextInputType.number,

                    decoration: InputDecoration(
                      hintText: 'Número de documento',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  // PASSWORD
                  TextFormField(
                    controller: passwordController,
                    obscureText: true,

                    decoration: InputDecoration(
                      hintText: 'Ingrese su contraseña',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),

                  const SizedBox(height: 15),

                  // CONFIRMAR PASSWORD
                  TextFormField(
                    controller: confirmPasswordController,
                    obscureText: true,

                    decoration: InputDecoration(
                      hintText: 'Confirmar contraseña',

                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),

                    validator: (value) {

                      if (value != passwordController.text) {
                        return 'Las contraseñas no coinciden';
                      }

                      return null;
                    },
                  ),

                  const SizedBox(height: 25),

                  // BOTON
                  ElevatedButton(

                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFC45A77),
                      padding: const EdgeInsets.symmetric(vertical: 15),
                    ),

                    onPressed: () {

                      if (_formKey.currentState!.validate()) {

                        ScaffoldMessenger.of(context).showSnackBar(

                          const SnackBar(
                            content: Text(
                              'Registro exitoso',
                            ),
                          ),
                        );

                        Navigator.pushNamed(context, '/login');
                      }
                    },

                    child: const Text(
                      'Guardar',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}