//CP-001
function registrarCliente(datosCliente) { 
    if (!datosCliente.id_usuario || !datosCliente.nom_1 || !datosCliente.ape_1 || !datosCliente.correo || !datosCliente.telefono || !datosCliente.contrasena || !datosCliente.t_doc) {
        return { error: 'Faltan datos obligatorios para el registro'};
    }
    const existeDocumento = usuariosExistentes.some(u => u.id_usuario === datosCliente.id_usuario);
    if (existeDocumento) {
        return { error: 'El numero de documento ya se encunetra registrado por otro usuario'};
    }
    return {
        success: true,
        mensaje: 'Cliente registrado exitosamente',
        cliente: {
            id_usuario: datosCliente.id_usuario,
            nom_1: datosCliente.nom_1,
            nom_2: datosCliente.nom_2 || null,
            ape_1: datosCliente.ape_1,
            ape_2: datosCliente.ape_2 || null,
            correo: datosCliente.correo,
            telefono: datosCliente.telefono,
            contrasena: datosCliente.contrasena,
            t_doc: datosCliente.t_doc,
            id_rol_usuario: "2",
        }
    };
}

//CP-002
function registrarTrabajador(datosTrabajador) {
    if (!datosTrabajador.id_usuario || !datosTrabajador.nom_1 || !datosTrabajador.ape_1 || !datosTrabajador.correo || !datosTrabajador.telefono || !datosTrabajador.contrasena || !datosTrabajador.t_doc || !datosTrabajador.codigo) {
        return { error: 'Faltan datos obligatorios para el registro' };
    }
    const existeDocumento = usuariosExistentes.some(u => u.id_usuario === datosCliente.id_usuario);
    if (existeDocumento) {
        return { error: 'El numero de documento ya se encunetra registrado por otro usuario'};
    }
    return {
        success: true,
        mensaje: 'Trabajador registrado exitosamente',
        trabajador: {
        id_usuario: datosTrabajador.id_usuario,
        nom_1: datosTrabajador.nom_1,
        nom_2: datosTrabajador.nom_2 || null,
        ape_1: datosTrabajador.ape_1,
        ape_2: datosTrabajador.ape_2 || null,
        correo: datosTrabajador.correo,
        telefono: datosTrabajador.telefono,
        contrasena: datosTrabajador.contrasena,
        t_doc: datosTrabajador.t_doc,
        codigo: datosTrabajador.codigo,
        id_rol_usuario: "1",
        }
    }
}

//CP-003
function registrarAdministrador(datosAdministrador) {
    if (!datosAdministrador.id_usuario || !datosAdministrador.nom_1 || !datosAdministrador.ape_1 || !datosAdministrador.correo || !datosAdministrador.telefono || !datosAdministrador.contrasena || !datosAdministrador.t_doc || !datosAdministrador.codigo) {
        return { error: 'Faltan datos obligatorios para el registro' };
    }
    const existeDocumento = usuariosExistentes.some(u => u.id_usuario === datosAdministrador.id_usuario);
    if (existeDocumento) {
        return { error: 'El numero de documento ya se encunetra registrado por otro usuario'};
    }
    return {
        success: true,
        mensaje: 'Administrador registrado exitosamente',
        administrador: {
        id_usuario: datosAdministrador.id_usuario,
        nom_1: datosAdministrador.nom_1,
        nom_2: datosAdministrador.nom_2 || null,
        ape_1: datosAdministrador.ape_1,
        ape_2: datosAdministrador.ape_2 || null,
        correo: datosAdministrador.correo,
        telefono: datosAdministrador.telefono,
        contrasena: datosAdministrador.contrasena,
        t_doc: datosAdministrador.t_doc,
        codigo: datosAdministrador.codigo,
        id_rol_usuario: "3",
        }
    }
}


module.exports = { registrarCliente, registrarTrabajador, registrarAdministrador };