import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderUsuarios from "../../components/HeaderUsuarios";
import "../../components/admin.css";


export default function Productos(){
    return(
        <div className="dashboard-layout">
           <Sidebar />

            <main className="contenido">
            <HeaderUsuarios />

                <section className="cuadro-blanco usuarios-section">
                    <div className="usuarios-header">
                        <button className="btn-activo">Informacion de los usuarios</button>

                        <Link to="/registrar_usuario" className="registrar">
                            <button className="btn-registrar">
                                Registrar Usuario
                            </button>
                        </Link>
                    </div>

                    <div className="tabla-usuarios">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>   {/*icono para editar*/}
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                    <th>Fecha de inicio</th>
                                    <th>Teléfono</th>
                                    <th>Pedidos registrados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*fila1*/}
                                <tr>
                                    <td></td>
                                    <td>01</td>
                                    <td>Mariana Lopez</td>
                                    <td>Cliente</td>
                                    <td>22/06/025</td>
                                    <td>3208980258</td>
                                    <td>
                                        <div className="detalle-pedido">
                                            <h4>Primer pedido (24/06/2025)</h4>
                                            <ul>
                                                <li>Virogranos XL, precio a pagar: $114.000</li>
                                                <li>Sábanas flores XL, precio a pagar: $75.000</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}