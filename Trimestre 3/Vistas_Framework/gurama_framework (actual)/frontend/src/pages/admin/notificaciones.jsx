import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";

export default function Movimientos(){
    return(
        <div className="dashboard-layout">
           <Sidebar />
            <main className="contenido">
            <HeaderPanel />

                  <section className="pedidos cuadro-blanco">
                    <section className="notificaciones">
                        <h2>Notificaciones</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Mensaje</th>
                                    <th>Detalles</th>
                                    {/* Eliminada la columna 'Acciones' para simplificar */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* --- Fila 1: Alerta de stock --- */}
                                <tr>
                                    <td>01</td>
                                    <td>Alerta de bajo stock</td>
                                    {/* Esta celda contendrá el texto y el botón alineado a la derecha */}
                                    <td className="detalles-con-accion">
                                        <div className="detalles-texto">
                                            Sábanas cama sencilla de Paw Patrol <br />
                                            <small>Últimas 2 unidades</small>
                                        </div>
                                        {/* CORRECCIÓN: Link envuelve el botón para navegar */}
                                        <Link to="/movimientos" className="link-boton">
                                            <button className="ir stock">
                                                Ir a movimientos
                                            </button>
                                        </Link>
                                    </td>
                                </tr>

                                {/* --- Fila 2: Nuevo pedido --- */}
                                <tr>
                                    <td>02</td>
                                    <td>Se agregó nuevo pedido</td>
                                    <td className="detalles-con-accion">
                                        <div className="detalles-texto">
                                            Id_pedido: P06706C <br />
                                            Cliente: Maria Lopez <br />
                                            <small>Personalizado</small>
                                        </div>
                                        {/* CORRECCIÓN: Link envuelve el botón para navegar */}
                                        <Link to="/pedidos_realizados" className="link-boton">
                                            <button className="ir pedido">
                                                Ir a pedidos
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </section>
            </main>
        </div>
    );
}