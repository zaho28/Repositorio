import React from 'react';
import { Link } from 'react-router-dom';
//estilos
import "../../components/cliente.css";
//imagenes
//import Cubrelecho from './p_cubrelecho.jsx';"../../assets/cubrelecho.webp"
import p_sabana from"../../assets/sabana.webp"
import p_cubrelechos from"../../assets/cubrelecho.webp"
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx';
 
const PedidosPersonalizados = () => {
    return (
        <div className="app-container">

            <Header />

            <main className="pedidos-personalizados">
                <h2>Pedidos personalizados</h2>
                <p>Diseña tus pedidos a medidia</p>
                    
                <div className="productos-grid">
                    {/* Opción 1: Sábanas */}
                    <div className="tarjeta-producto">
                        <Link to="/p_sabanas" className="boton-producto">Sábanas
                            <img src={p_sabana} alt="Logo Gurama Online" /> 
                        </Link> 
                    </div>

                    {/* Opción 2: Cubrelechos */}
                    <div className="tarjeta-producto">
                        {/* Imagen cubrelecho */}
                        <Link to="/p_cubrelecho" className="boton-producto">Cubrelechos
                            <img src={p_cubrelechos} alt="Logo Gurama Online" />
                        </Link>
                    </div>
                </div>
            </main>
                
            <Footer />
        </div>
    );
};

export default PedidosPersonalizados;