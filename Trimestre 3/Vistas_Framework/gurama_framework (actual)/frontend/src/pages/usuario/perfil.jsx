import React from 'react';
import { Link } from 'react-router-dom';
//estilos
import "../../components/cliente.css";
//imagenes (si tienes una imagen de perfil, impórtala aquí)
// import userProfilePic from '../../assets/user-avatar.webp'; 

// header y footer
import Header from '../../components/Header_c.jsx'; 
// import Footer from '../../components/Footer.jsx'; // Si usas un Footer aquí

const PerfilUsuario = () => {
    return (
        <>
            <Header />

            <main>
                <section className="perfil-box"> {/* Este es el contenedor centrado */}
                    <div className="profile-card"> {/* La tarjeta principal de perfil */}
                        <h2>Perfil</h2>
                        
                        <div className="profile-content"> {/* Contenedor para info y foto */}
                            <div className="info">
                                <h4>
                                    <strong>Nombre de usuario</strong><br />
                                    <span className="dato">Maria Lopez</span>
                                </h4>

                                <h4>
                                    <strong>Correo electrónico</strong><br />
                                    <span className="dato">MariLz45@gmail.com</span>
                                </h4>

                                <h4>
                                    <strong>Número telefónico</strong><br />
                                    <span className="dato">3287865455</span>
                                </h4>

                                <h4>
                                    <strong>Identificación</strong><br />
                                    <span className="dato">CC 1434500044</span>
                                </h4>
                            </div>

                            {/* Foto de perfil y rol (renombrado de .foto a .profile-picture) */}
                            <div className="profile-picture">
                                {/* Puedes colocar un <img> aquí si tienes una foto de perfil real */}
                                {/* <img src={userProfilePic} alt="Foto de perfil" /> */}
                                {/* Icono de usuario de ejemplo si no hay imagen */}
                                <span className="placeholder-icon"></span> 
                                <span className="user-role">Usuario</span> {/* Rol de usuario */}
                            </div>
                        </div>

                        {/* Acciones (renombrado de .acciones a .actions-container) */}
                        <div className="actions-container">
                            <Link to="/cambiar_datos">
                                <button className="btn rosa">Cambiar datos</button>
                            </Link>

                            <Link to="/cambiar_contraseña2">
                                <button className="btn rosa">Cambiar contraseña</button>
                            </Link>
                            
                            <Link to="/"> 
                                <button className="btn gris">Cerrar sesión</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default PerfilUsuario;