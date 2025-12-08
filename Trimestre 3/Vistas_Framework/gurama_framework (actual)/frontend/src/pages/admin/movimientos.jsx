import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebarmov from "../../components/Sidebarmov";
import HeaderMovimientos from "../../components/HeaderMovimientos";
import "../../components/admin.css";

export default function Movimientos(){
    return(
        <div className="dashboard-layout">
            <Sidebarmov />
            <main className="contenido">
            <HeaderMovimientos />

                <section className="cuadro-blanco movimientos-principal">
                    <h2>Registre todas sus entradas y salidas aquí</h2> {/* Texto ajustado */}

                    <div className="contenedor-movimientos">

                        <div className="tarjeta">
                            <div className="texto">
                                {/* Texto de la tarjeta */}
                                Entradas 
                            </div>
                            {/* BOTÓN CÍRCULO CON LINK */}
                            <Link to="/entradas" className="btn-agregar">
                                +
                            </Link>
                        </div>

                        <div className="tarjeta">
                            <div className="texto">
                                {/* Texto de la tarjeta */}
                                Salidas
                            </div>
                            {/* BOTÓN CÍRCULO CON LINK */}
                            <Link to="/salidas" className="btn-agregar">
                                +
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}