import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//estilos
import "../../components/cliente.css";
//imagenes
import p_sabana from"../../assets/sabana.webp";

// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';

const PersonalizarSabana = () => {

    const [tamano, setTamano] = useState('');
    const [almohada, setAlmohada] = useState('');

    const handleTamanoChange = (event) => setTamano(event.target.value);
    const handleAlmohadaChange = (event) => setAlmohada(event.target.value);

    return (
        <div className="app-container">
            <Header />

            <main>
                <section className="contenedor-imagen">
                    <div className="tarjeta-imagen">

                        <Link to="/pedidos_personalizados" className="btn-volver">
                         <button className="btn-volver">Volver</button>
                        </Link>

                        <h2>Personalizar sábana</h2>
                        <img src={p_sabana} alt="Logo Gurama Online" />
                        <p className="nota-precio">El precio puede variar según la disponibilidad de materiales.</p>
                    
                        <button className="btn-guardar">Guardar cambios</button>
                    </div>

                    <div className="panel derecho">
                        {/* Opción: Tamaño de sábana */}
                        <div className="panel-opciones">
                            <h3>Tamaño de sábana</h3>
                            <div className="opciones-grid">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="cuna" 
                                        checked={tamano === 'cuna'}
                                        onChange={handleTamanoChange}
                                    /> Cuna (100 x 145 cm)
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="individual"
                                        checked={tamano === 'individual'}
                                        onChange={handleTamanoChange}
                                    /> Individual (180 x 275 cm)
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="doble"
                                        checked={tamano === 'doble'}
                                        onChange={handleTamanoChange}
                                    /> Doble (230 x 275 cm)
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="rey"
                                        checked={tamano === 'rey'}
                                        onChange={handleTamanoChange}
                                    /> Rey (275 x 275 cm)
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="rey_europeo"
                                        checked={tamano === 'rey_europeo'}
                                        onChange={handleTamanoChange}
                                    /> Rey europeo (300 x 275 cm)
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="tamano" 
                                        value="emperador"
                                        checked={tamano === 'emperador'}
                                        onChange={handleTamanoChange}
                                    /> Emperador (320 x 290 cm)
                                </label>
                            </div>
                        </div>

                        {/* Opción: Funda de almohada */}
                        <div className="panel-opciones">
                            <h3>¿Quiere añadir la funda de almohada?</h3>
                            <div className="opciones-grid">
                                <label>
                                    <input 
                                        type="radio" 
                                        name="almohada" 
                                        value="no"
                                        checked={almohada === 'no'}
                                        onChange={handleAlmohadaChange}
                                    /> No, sin almohadas
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="almohada" 
                                        value="una"
                                        checked={almohada === 'una'}
                                        onChange={handleAlmohadaChange}
                                    /> Una funda de almohada
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="almohada" 
                                        value="dos"
                                        checked={almohada === 'dos'}
                                        onChange={handleAlmohadaChange}
                                    /> Dos fundas de almohada
                                </label>
                            </div>
                        </div>

                        {/* Opción: Diseño / Estampados */}
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

export default PersonalizarSabana;