import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Headerreg from "../components/Header_reg";

const BASE_URL = "http://localhost:3001/api/usuarios";
const Registro = () => {
  const [nom_1, setNom1] = useState("");
  const [nom_2, setNom2] = useState("")
  const [ape_1, setApe1] = useState(""); // Nuevo: Primer Apellido
  const [ape_2, setApe2] = useState("")
  const [id_usuario, setIdUsuario] = useState(""); // Nuevo: ID (CC/TI,etc)
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [t_doc, setTDoc] = useState("CC"); // Por defecto: 1 (: Cédula)
  const [telefono, setTelefono] = useState(""); 
  
  const [items, setItems] = useState([]); 

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}`)
      .then((response) => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error al obtener los usuarios:", error)
      });
  }, []);

  const handleCreate = (e) => {
    e.preventDefault(); // Prevenir la recarga de la página

if (id_usuario.trim() && nom_1.trim() && ape_1.trim() && correo.trim() && telefono.trim() && contrasena.trim()) {      
      const userData = {
        // CAMPOS DEL FORMULARIO
        id_usuario: id_usuario.trim(), 
        nom_1: nom_1.trim(),
        nom_2: nom_2.trim() || null,
        ape_1: ape_1.trim(),
        ape_2: ape_2.trim() || null,
        correo: correo.trim(),
        telefono: telefono.trim(),
        contrasena: contrasena.trim(),
        t_doc: t_doc,

        nom_2: null, 
        ape_2: null,
        codigo: null, 
        id_rol_usuario: "2", // 2 = Rol de Cliente/Usuario
  };

  axios.post(`${BASE_URL}/add`, userData)
        .then(response => {
          console.log("Registro Exitoso:", response.data);
          alert("¡Registro exitoso! Ya puedes iniciar sesión.");
          navigate('/login'); // Redirigir después del registro
        })
        .catch(error => {
          // Muestra el error específico de la respuesta del servidor
          const errorMessage = error.response?.data?.details || error.message;
          console.error("Error al registrar el usuario:", errorMessage);
          alert(`Error al registrar: ${errorMessage}`);
        });
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    } 
  };

  return (
    <>
      <Headerreg />
      
      <main>
        <form className="form-registro" onSubmit={handleCreate}>
          <h2 className="subtitulo">Crear cuenta</h2>

          <label htmlFor="t_doc">Tipo de Documento</label>
          <select 
            id="t_doc" 
            value={t_doc} 
            onChange={(e) => setTDoc(e.target.value)}
            required
          >
            <option value="CC">Cédula de Ciudadanía (CC)</option> 
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
          </select>

          <label htmlFor="id_usuario">Número de documento</label>
          <input
            type="text"
            id="id_usuario"
            value={id_usuario}
            onChange={(e) => setIdUsuario(e.target.value)}
            placeholder="ingrese su número de documento"
            required
          />

          <label htmlFor="nom_1">Primer Nombre</label>
          <input
            type="text"
            id="nom_1"
            value={nom_1}
            onChange={(e) => setNom1(e.target.value)}
            placeholder="Tu primer nombre"
            required
          />

          <label htmlFor="nom_2">Segundo Nombre (Opcional)</label>
          <input
            type="text"
            id="nom_2"
            value={nom_2}
            onChange={(e) => setNom2(e.target.value)}
            placeholder="Tu segundo nombre"
          />

          <label htmlFor="ape_1">Primer Apellido</label>
          <input
            type="text"
            id="ape_1"
            value={ape_1}
            onChange={(e) => setApe1(e.target.value)}
            placeholder="Tu primer apellido"
            required
          />

          <label htmlFor="ape_2">Segundo Apellido (Opcional)</label>
          <input
            type="text"
            id="ape_2"
            value={ape_2}
            onChange={(e) => setApe2(e.target.value)}
            placeholder="Tu segundo apellido"
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
          
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Número de teléfono"
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
          
          <button onClick={handleCreate}>Registrarse</button> 
        </form>
      </main>
        </>
    );
}

export default Registro;