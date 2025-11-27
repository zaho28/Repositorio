import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a.jsx";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";

export default function FormularioProducto() {
    return (
    
    <div className="dashboard-layout">
        <Sidebar />
    
        <main className="contenido">
            <HeaderPanel />

            <section>
                {/* Aquí asumimos que tienes un HeaderPanel que va antes del formulario */}

                <form className="formulario" action="#" method="post">
            
                    <div className="campo">
                        <label htmlFor="id_producto">ID Producto</label>
                        <input 
                            type="number" 
                            id="id_producto" 
                            name="id_producto" 
                            placeholder="Ingrese el ID del producto" 
                            required 
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="nombre_producto">Producto</label>
                        <input 
                            type="text" 
                            id="nombre_producto" 
                            name="nombre_producto" 
                            placeholder="Ejemplo: Sábana Paw Patrol" 
                            required 
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="cantidad">Stock</label>
                        <input 
                            type="number" 
                            id="cantidad" 
                            name="cantidad" 
                            placeholder="Cantidad de unidades" 
                            required 
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="categoria">Categoria</label>
                        <input 
                            type="text" 
                            id="categoria" 
                            name="categoria" 
                            placeholder="categoria" 
                            required 
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="precio">Precio</label>
                        <input 
                            type="number" 
                            id="precio" 
                            name="precio" 
                            placeholder="Precio del producto" 
                            required 
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="descripcion">Descripcion</label>
                        <textarea 
                            id="descripcion" 
                            name="descripcion" 
                            placeholder="Detalles adicionales..." 
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="botones">
                        <button type="submit" className="btn-guardar">
                            <i className="fa-solid fa-floppy-disk" /> Guardar
                        </button>
                        
                        <button type="reset" className="btn-cancelar"> 
                            <i className="fa-solid fa-xmark" /> Cancelar
                        </button>
                    </div>
                </form>
            </section>
        </main>
    </div>
    );
}