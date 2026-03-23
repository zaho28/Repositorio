import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//estilos
import "../../components/css/styles.css";
//imagenes
import p_cubrelechos from"../../assets/cubrelecho.webp"
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';
const PersonalizarCubrelecho = () => {

    const [ladoActivo, setLadoActivo] = useState('lado1');

    return (
        <div className="app-container">
            <Header/>

            <main>
                <section className="contenedor-imagen">
                    <div className="tarjeta-imagen">

                        {/* Botón Volver usando Link de React Router */}
                        <Link to="/pedidos_personalizados" className="btn-volver">
                            <button className="btn-volver">Volver</button>
                        </Link>

                        <h2>Personalizar Cubrelecho</h2>
                        <img src={p_cubrelechos} alt="Logo Gurama Online" />
                        <p className="nota-precio">El precio puede variar según la disponibilidad de materiales.</p>

                        <button className="btn-guardar">Guardar cambios</button>
                    </div>
                    
                    <div className="panel-opciones">
                        {/* Tamaño */}
                        <div className="campo">
                            <h3>Tamaño cama</h3>
                            <select defaultValue="">
                                <option value="" disabled>Seleccionar</option>
                                <option value="sencilla">Sencilla</option>
                                <option value="semidoble">Semidoble</option>
                                <option value="doble">Doble</option>
                                <option value="queen">Queen</option>
                                <option value="king">King</option>
                            </select>
                        </div>

                        {/* Tipo de tela */}
                        <div className="opcion">
                            <h3>Seleccionar tipo de tela</h3>
                            <div className="botones-tela">
                                <button 
                                    className={`btn-tela ${ladoActivo === 'lado1' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado1')}
                                >
                                    Lado 1
                                </button>
                                <button 
                                    className={`btn-tela ${ladoActivo === 'lado2' ? 'activo' : ''}`}
                                    onClick={() => setLadoActivo('lado2')}
                                >
                                    Lado 2
                                </button>
                            </div>

                            {/* Panel para Lado 1 (Se muestra condicionalmente) */}
                            {ladoActivo === 'lado1' && (
                                <div className="panel-tela" id="panelLado1">
                                    <div className="grupo-telas">
                                        <h5>lado 1</h5>
                                        <h4>Telas sin diseño <span>N/A</span></h4>
                                        <div className="opciones-tela">
                                            <p>Ovejero</p>
                                            <p>Conejo</p>
                                            <p>Venus pelo largo</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        
                            {/* Panel para Lado 2 (Se muestra condicionalmente) */}
                            {ladoActivo === 'lado2' && (
                                <div className="panel-tela" id="panelLado2">
                                    <div className="grupo-telas">
                                        <h5>lado 2</h5>
                                        <h4>Telas sin diseño <span>N/A</span></h4>
                                        <div className="opciones-tela">
                                            <p>Ovejero</p>
                                            <p>Conejo</p>
                                            <p>Venus pelo largo</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Diseño / Estampados */}
                        <div className="panel-opciones">
                            <h3>Diseño / Estampados</h3>
                            <button className="btn-accion-detalle">Ver diseños</button>
                        </div>

                        {/* Vista previa del precio */}
                        <div className="vista-precio">
                            <label>Vista previa del precio</label>
                            <input type="text" placeholder="$0.00" readOnly />
                        </div>
                    </div>
                </section>
            </main> 

            <Footer />
            
        </div>
    );
};

export default PersonalizarCubrelecho;