import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Importamos el archivo de estilos (asumo que se llama admin.css)
import "../../components/admin.css"; 

// ===============================================
// COMPONENTES AJUSTADOS (Usando clases CSS de Layout)
// ===============================================

// Componente para la barra superior
const HeaderPanel = ({ title }) => (
    <header className="header-panel">
        <h1 className="header-title">{title}</h1>
    </header>
);

// Componente para la barra lateral
const SidebarMov = () => (
    <aside className="sidebar-mov">
        <div className="sidebar-logo">Sistema App</div>
        <nav className="sidebar-nav">
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/register" className="nav-link active">Registrar Usuario</Link>
            <Link to="/login" className="nav-link">Login</Link>
        </nav>
    </aside>
);

// URL base de tu API
const BASE_URL = "http://localhost:3001/api/usuarios";

/**
 * Componente para el formulario de registro de nuevos usuarios.
 */
const Registrar_usuario = () => {
    // --------------------------------
    // 1. ESTADO DEL COMPONENTE
    // --------------------------------
    const [nom_1, setNom1] = useState("");
    const [nom_2, setNom2] = useState("");
    const [ape_1, setApe1] = useState("");
    const [ape_2, setApe2] = useState("");
    const [id_usuario, setIdUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [codigo, setCodigo] = useState("");
    const [t_doc, setTDoc] = useState("CC"); 
    const [telefono, setTelefono] = useState("");
    const [items, setItems] = useState([]); // Mantener por si se usa más tarde
    
    // Estado para mensajes de feedback al usuario (usamos esta variable para mejor UX)
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    
    const navigate = useNavigate();

    // --------------------------------
    // 2. EFECTO PARA CARGAR DATOS (Inicialización)
    // --------------------------------
    useEffect(() => {
        // ... (Tu lógica de useEffect se mantiene)
        axios.get(`${BASE_URL}`)
            .then((response) => {
                setItems(response.data);
                // console.log("Datos iniciales cargados:", response.data);
            })
            .catch(error => {
                console.error("Error al obtener los usuarios:", error);
            });
    }, []);

    // --------------------------------
    // 3. FUNCIÓN DE REGISTRO (Manejo del formulario)
    // --------------------------------
    const handleCreate = async (e) => {
        e.preventDefault();

        // Función para mostrar mensajes de error/éxito
        const showMessage = (message, type = 'error') => {
            setMensaje({ text: message, type: type });
        };

        if (!id_usuario.trim() || !nom_1.trim() || !ape_1.trim() || !correo.trim() || !telefono.trim() || !contrasena.trim() || !codigo.trim()) {
            showMessage("Por favor, complete todos los campos obligatorios.", 'error');
            return; 
        }

        const userData = {
            id_usuario: id_usuario.trim(),
            nom_1: nom_1.trim(),
            nom_2: nom_2.trim() || null,
            ape_1: ape_1.trim(),
            ape_2: ape_2.trim() || null,
            correo: correo.trim(),
            telefono: telefono.trim(),
            contrasena: contrasena.trim(),
            t_doc: t_doc,
            codigo: codigo.trim(),
            id_rol_usuario: "1", 
        };

        try {
            const response = await axios.post(`${BASE_URL}/add`, userData);
            // console.log("Registro Exitoso:", response.data);
            showMessage("¡Registro exitoso! Ya puede iniciar sesión. Redirigiendo...", 'success');
            
            setTimeout(() => {
                navigate('/login'); 
            }, 1500);

        } catch (error) {
            const errorMessage = error.response?.data?.details || error.message || "Error desconocido en el registro.";
            console.error("Error al registrar el usuario:", errorMessage);
            showMessage(`Error al registrar: ${errorMessage}`);
        }
    };

    // --------------------------------
    // 4. RENDERIZADO DEL COMPONENTE (Con clases de Layout)
    // --------------------------------
    return (
        <div className="dashboard-layout"> {/* CLASE CORREGIDA */}
            <SidebarMov /> {/* Componente ajustado */}

            <div className="contenido"> {/* Contenedor principal de la vista */}
                <HeaderPanel title="Registrar Nuevo Usuario"/> {/* Componente ajustado */}

                <main className="p-4 sm:p-6 lg:p-8 flex-1">
                    {/* Mensaje de alerta */}
                    {mensaje.text && (
                        <div className={`alerta ${mensaje.type} max-w-lg mx-auto`}>
                            {mensaje.text}
                        </div>
                    )}
                    
                    {/* Contenedor centralizado para el formulario (usamos la clase CSS) */}
                    <div className="form-card-container"> {/* CLASE CORREGIDA */}
                        <form
                            className="form-registro space-y-5"
                            onSubmit={handleCreate}
                        >
                            <h2 className="text-3xl font-extrabold text-center text-indigo-600 subtitulo mb-6">
                                Crear Cuenta
                            </h2>

                            {/* El resto de tus campos de formulario se mantienen iguales, 
                                ya que el CSS los estilizará. */}
                            
                            {/* Campo Tipo de Documento */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="t_doc" className="text-sm font-medium text-gray-700">Tipo de Documento</label>
                                <select
                                    id="t_doc"
                                    value={t_doc}
                                    onChange={(e) => setTDoc(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    required
                                >
                                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                                    <option value="CE">Cédula de Extranjería (CE)</option>
                                    <option value="TI">Tarjeta de Identidad (TI)</option>
                                </select>
                            </div>

                            {/* Campo Número de documento */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="id_usuario" className="text-sm font-medium text-gray-700">Número de documento <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="id_usuario"
                                    value={id_usuario}
                                    onChange={(e) => setIdUsuario(e.target.value)}
                                    placeholder="Ingrese su número de documento"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Primer Nombre */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="nom_1" className="text-sm font-medium text-gray-700">Primer Nombre <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="nom_1"
                                    value={nom_1}
                                    onChange={(e) => setNom1(e.target.value)}
                                    placeholder="Primer nombre"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Segundo Nombre (Opcional) */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="nom_2" className="text-sm font-medium text-gray-700">Segundo Nombre (Opcional)</label>
                                <input
                                    type="text"
                                    id="nom_2"
                                    value={nom_2}
                                    onChange={(e) => setNom2(e.target.value)}
                                    placeholder="Segundo nombre"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Campo Primer Apellido */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ape_1" className="text-sm font-medium text-gray-700">Primer Apellido <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="ape_1"
                                    value={ape_1}
                                    onChange={(e) => setApe1(e.target.value)}
                                    placeholder="Primer apellido"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Segundo Apellido (Opcional) */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="ape_2" className="text-sm font-medium text-gray-700">Segundo Apellido (Opcional)</label>
                                <input
                                    type="text"
                                    id="ape_2"
                                    value={ape_2}
                                    onChange={(e) => setApe2(e.target.value)}
                                    placeholder="Segundo apellido"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Campo Correo electrónico */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="correo" className="text-sm font-medium text-gray-700">Correo electrónico <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    id="correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Teléfono */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="Número de teléfono"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Contraseña */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="contrasena" className="text-sm font-medium text-gray-700">Contraseña <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    id="contrasena"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Campo Código */}
                            <div className="flex flex-col space-y-1">
                                <label htmlFor="codigo" className="text-sm font-medium text-gray-700">Código <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    id="codigo"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                    placeholder="Ingrese nuevo código"
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            {/* Botón de Registro */}
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-[1.01]"
                            >
                                Registrarse
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Registrar_usuario;