import React, { useContext, useState, useRef, useEffect } from 'react';import { Link } from 'react-router-dom';
import HeaderPerfil from '../../components/HeaderPerfil'; 
import "../../components/perfil_admin.css"; 

import { AuthContext } from '../../context/AuthContext';
const API_URL = 'http://localhost:3001/api/usuarios';

export default function PerfilAdmin() {

    const { currentUser, logout, updateCurrentUser } = useContext(AuthContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    // ESTADO PARA CONTROLAR LA RECARGA DE LA IMAGEN
    const [reloadKey, setReloadKey] = useState(Date.now());

    // Si el usuario no está cargado (aún cargando o deslogueado), mostrar un mensaje de carga.
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser || !currentUser.id_usuario) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${currentUser.id_usuario}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    
                    // Actualizar el contexto con los datos completos
                    updateCurrentUser({
                        ...currentUser,
                        ...data
                    });
                } else {
                    console.error('Error al obtener datos del usuario');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser?.id_usuario]);

    if (!currentUser || loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    // Usar userData si está disponible, si no usar currentUser
    const user = userData || currentUser;

    const nombreCompleto = `${user.nom_1 } ${user.nom_2 || ''} ${user.ape_1} ${user.ape_2 || ''}`.trim();
    const tipoDocumento = user.desc_doc || user.t_doc || '';
    const identificacion = `${tipoDocumento} ${user.id_usuario}`.trim();

    // --------------------------------------------------------------
    // HANDLERS
    // --------------------------------------------------------------
    
    const handlePlaceholderClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadMessage('');
        setUploadError('');
    };

    const handleUpload = async () => {
        if (!selectedFile || !user || !user.id_usuario) {
            setUploadError('Debe seleccionar un archivo y estar logueado.');
            return;
        }

        setUploadMessage('Subiendo imagen...');
        setUploadError('');

        const formData = new FormData();
        formData.append('profileImage', selectedFile); 

        try {
            const response = await fetch(`${API_URL}/upload-image/${user.id_usuario}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            
            if (response.ok) {
                setUploadMessage('Imagen subida con éxito. Actualizando vista...');
                setSelectedFile(null);
                
                // Actualizar contexto y forzar recarga
                updateCurrentUser({ ...user, img_perfil: data.img_perfil });
                setReloadKey(Date.now());
            } else {
                setUploadError(data.message || data.error || 'Error al subir la imagen.');
                setUploadMessage('');
            }
        } catch (error) {
            console.error('Error en la subida:', error);
            setUploadError('Error de conexión o subida fallida.');
            setUploadMessage('');
        }
    };

    return (
        
        <div className="perfil-page-container"> 
            
            <HeaderPerfil />

            <main>
                <section className="perfil-box">
                    <div className="profile-card">
                        <h2>Perfil</h2>
                        
                        <div className="profile-content">
                        {/* SECCIÓN DE IMAGEN Y SUBIDA */}
                            <div className="profile-picture-container">
                                <div className="profile-picture" onClick={handlePlaceholderClick} role="button" tabIndex="0">
                                    {currentUser.img_perfil ? (
                                        <img 
                                            key={reloadKey} 
                                            src={`http://localhost:3001${currentUser.img_perfil}?t=${reloadKey}`}                                             alt="Perfil" 
                                            className="profile-image-actual"
                                        />               
                                    ) : (
                                        <span className="placeholder-icon"></span> 
                                    )}
                                    <span className="user-role">{currentUser.rol || currentUser.nombre_rol || 'Usuario'}</span> 
                                </div>
                                
                                {/* INPUT Y BOTÓN DE SUBIDA (Ocultos inicialmente, se muestran al seleccionar) */}
                                <div className="image-upload-controls">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        ref={fileInputRef} //  Referencia al input
                                        style={{ display: 'none' }} //  Ocultamos el input original
                                    />

                                    {/* Mostramos el nombre del archivo si está seleccionado */}
                                    {selectedFile && <p className="file-name-display">Archivo: **{selectedFile.name}**</p>}

                                    {/* Mostramos el botón de subida si se seleccionó un archivo */}
                                    {selectedFile && (
                                        <button 
                                            onClick={handleUpload} 
                                            className="btn rosa btn-upload" 
                                        >
                                            Confirmar Subida
                                        </button>
                                    )}
                                    {uploadMessage && <p className="upload-feedback" style={{ color: 'green' }}>{uploadMessage}</p>}
                                    {uploadError && <p className="upload-feedback" style={{ color: 'red' }}>{uploadError}</p>}
                                </div>
                            </div>

                            {/* SECCIÓN DE DATOS */}
                            <div className="info">
                                <h4>
                                    <strong>Nombre de usuario</strong><br />
                                    <span className="dato">{nombreCompleto}</span>
                                </h4>

                                <h4>
                                    <strong>Correo electrónico</strong><br />
                                    <span className="dato">{currentUser.correo}</span>
                                </h4>

                                <h4>
                                    <strong>Número telefónico</strong><br />
                                    <span className="dato">{currentUser.telefono}</span>
                                </h4>

                                <h4>
                                    <strong>Identificación</strong><br />
                                    <span className="dato">{identificacion}</span>
                                </h4>
                            </div>
                        </div>

                        {/*  SECCIÓN DE ACCIONES (Vuelve al final del profile-card) */}
                        <div className="actions-container">
                            <Link to="/cambiar_datos_a">
                                <button className="btn rosa">Cambiar datos</button>
                            </Link>
                            <Link to="/cambiar_contra3">
                                <button className="btn rosa">Cambiar contraseña</button>
                            </Link>
                            <Link to="/" onClick={logout}> 
                                <button className="btn gris">Cerrar sesión</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}