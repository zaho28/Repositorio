const { registrarCliente, registrarTrabajador } = require('./funciones');

describe('Pruebas unitarias de GuramaOnline', () => {

  test('Debería registrar al cliente con éxito si envía todos los campos requeridos', () => {
    const datosFrontend = {
      id_usuario: "10125587421",
      nom_1: "Juan",
      nom_2: "", 
      ape_1: "Perez",
      ape_2: "Gomez",
      correo: "juan@correo.com",
      telefono: "3215478542",
      contrasena: "123456789",
      t_doc: "CC"
    };

    const resultado = registrarCliente(datosFrontend);

    expect(resultado.success).toBe(true);
    expect(resultado.mensaje).toBe('Cliente registrado exitosamente');
    expect(resultado.cliente.id_rol_usuario).toBe("2");
    expect(resultado.cliente.nom_2).toBeNull();
  });


  test('Debería registrar al trabajador con éxito si envía todos los campos requeridos', () => {
    const datosFrontend = {
      id_usuario: "1012345678",
      nom_1: "Evelyn",
      nom_2: "", 
      ape_1: "Cardenas",
      ape_2: "Vega",
      correo: "evelyn@correo.com",
      telefono: "3001234567",
      contrasena: "segura123",
      t_doc: "CC",
      codigo: "TRAB-001"
    };

    const resultado = registrarTrabajador(datosFrontend);

    expect(resultado.success).toBe(true);
    expect(resultado.mensaje).toBe('Trabajador registrado exitosamente');
    expect(resultado.trabajador.id_rol_usuario).toBe("1");
    expect(resultado.trabajador.nom_2).toBeNull();
  });


  test('Debería registrar al administrador con éxito si envía todos los campos requeridos', () => {
    const datosFrontend = {
      id_usuario: "10224587798",
      nom_1: "Mariana",
      nom_2: "", 
      ape_1: "Gonzalez",
      ape_2: "",
      correo: "mariana@correo.com",
      telefono: "3001234567",
      contrasena: "marianita23",
      t_doc: "CC",
      codigo: "ADMIN-001"
    };

    const resultado = registrarAdministrador(datosFrontend);

    expect(resultado.success).toBe(true);
    expect(resultado.mensaje).toBe('Administrador registrado exitosamente');
    expect(resultado.administrador.id_rol_usuario).toBe("3");
    expect(resultado.administrador.nom_2).toBeNull();
    expect(resultado.administrador.ape_2).toBeNull();
  });


  test('Deberia retornar un error si el numero de documento ya existe en el sistema', () => {
    const usuarioExistente = [
      { id_usuario: "1023898051"}
    ]
  })
});