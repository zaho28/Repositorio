import React from "react";
import { Link, useLocation } from 'react-router-dom';

//componentes
import Sidebar from "../../components/Sidebar_p-a";
import HeaderProductos from "../../components/HeaderProductos";
import "../../components/admin.css";

export default function Productos(){
    return(
        <div className="dashboard-layout">
        <Sidebar />

            <main className="contenido">
            <HeaderProductos /> 

                <section className="cuadro-blanco">
                    <div className="acciones">
                        
                        <button className="btn-categoria">Confecciones</button> 
                        
                    
                        <input type="text" placeholder="Filtrar categoria" className="buscar" /> 

                        <Link to="/registro_prod" className="registrar">
                            <button className="btn-registrar">
                                Registrar nuevo Producto
                            </button>
                        </Link>
                    </div>

                    
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Categoria</th>
                                <th>Descripcion</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {/*fila1*/}
                            <tr>
                                <td>001</td>
                                <td>Virgencitas de crochet de 20 CM</td>
                                <td>Tejidos</td>
                                <td>Hechas totalmente a mano con hilo de algodón. Tamaño 20 cm. Ideales para regalo o decoración.</td>
                                <td>$45.000</td>
                                <td>120</td>
                                <td>
                                    {/* Los enlaces de acción usan los className 'editar' y 'eliminar' */}
                                    <Link to="/editar_productos" className="editar">Editar</Link>
                                    <Link to="/productos" className="eliminar">Eliminar</Link>
                                </td>
                            </tr>

                            {/*fila2*/}
                            <tr>
                                <td>002</td>
                                <td>Ramo tulipanes tejidos</td>
                                <td>Tejidos</td>
                                <td>Tulipanes de hilo 100% algodón. Ramo de 7 flores con cinta decorativa. Perfecto para regalar.</td>
                                <td>$38.000</td>
                                <td>90</td>
                                <td>
                                    <Link to="/editar_productos" className="editar">Editar</Link>
                                    <Link to="/productos" className="eliminar">Eliminar</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div> 
    );
}