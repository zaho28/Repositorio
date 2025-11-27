// src/pages/PerfilAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderPerfil from '../../components/HeaderPerfil'; // Importamos el nuevo componente
// importación de estilos globales o específicos de la página
import "../../components/perfil_admin.css"; 

export default function PerfilAdmin() {
    return (
        // En lugar de <main>, es común envolver toda la página en un div o fragmento
        <div className="perfil-page-container"> 
            
            {/* Usamos el componente Header importado */}
            <HeaderPerfil />

            <main>
                <section className="perfil-box"> {/* Este es el contenedor centrado */}
                    <div className="profile-card"> {/* La tarjeta principal de perfil */}
                        <h2>Perfil</h2>
                        
                        <div className="profile-content"> {/* Contenedor para info y foto */}
                            <div className="info">
                                <h4>
                                    <strong>Nombre de usuario</strong><br />
                                    <span className="dato">Andrea Gurama</span>
                                </h4>

                                <h4>
                                    <strong>Correo electrónico</strong><br />
                                    <span className="dato">usuario@gmail.com</span>
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
                                <span className="user-role">Administradora</span> {/* Rol de usuario */}
                            </div>
                        </div>

                        {/* Acciones (renombrado de .acciones a .actions-container) */}
                        <div className="actions-container">
                            <Link to="/cambiar_datos_a">
                                <button className="btn rosa">Cambiar datos</button>
                            </Link>

                            <Link to="/cambiar_contra3">
                                <button className="btn rosa">Cambiar contraseña</button>
                            </Link>
                            
                            <Link to="/"> 
                                <button className="btn gris">Cerrar sesión</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}