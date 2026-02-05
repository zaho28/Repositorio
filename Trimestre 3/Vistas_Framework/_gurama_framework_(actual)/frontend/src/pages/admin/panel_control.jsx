import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";

export default function PanelControl(){
    return(
    <div className="dashboard-layout">
        <Sidebar />

        <main className="contenido">
        <HeaderPanel />

            <section className="opciones">
                <h2>Selecciona una opción</h2>
                <div className="opciones-botones">
                    <a href="reportes"> 
                         {/*aqui va para conectar con reportes */}
                        <div className="opcion">
                            <p>Reportes</p>
                        </div>
                    </a>

                    <a href="historial_ventas">   {/*aqui va para conectar el historial de historial_ventas*/}
                        <div className="opcion">
                            <p>Historial de ventas</p>
                        </div>
                    </a>

                    <a href="notificaciones">   {/*aqui va para conectar */}
                        <div className="opcion">
                            <p>Notificaciones</p>
                        </div>
                    </a>
                </div>
            </section>

            <section className="cuadro-blanco"></section>
        </main>
    </div>
    );
}