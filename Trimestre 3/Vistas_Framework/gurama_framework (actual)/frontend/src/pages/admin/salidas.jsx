import React from "react";
// Importamos los componentes del layout
import Sidebarmov from "../../components/Sidebarmov";
import HeaderPanel from "../../components/HeaderPanel";
// Importamos los estilos del formulario (asumimos que son los estilos generales de admin)
import "../../components/admin.css"; 



export default function FormularioEntradaProducto() {
    return (
        <div className="dashboard-layout">
            <Sidebarmov />
        
            <main className="contenido">
                <HeaderPanel />

                {/* El contenedor cuadro-blanco le da la apariencia de tarjeta al formulario */}
                <section className="cuadro-blanco form-producto">
                    
                    <form className="formulario" action="#" method="post">
                        
                        {/* ID Producto */}
                        <div className="campo">
                            <label htmlFor="id_producto">ID del Producto</label>
                            <input 
                                type="number" 
                                id="id_producto" 
                                name="id_producto" 
                                placeholder="Ingrese el ID del producto" 
                                required 
                            />
                        </div>

                        {/* Nombre del Producto */}
                        <div className="campo">
                            <label htmlFor="nombre_producto">Nombre del Producto</label>
                            <input 
                                type="text" 
                                id="nombre_producto" 
                                name="nombre_producto" 
                                placeholder="Ejemplo: Sábana Paw Patrol" 
                                required 
                            />
                        </div>

                        {/* Cantidad retirada */}
                        <div className="campo">
                            <label htmlFor="cantidad">Cantidad retirada</label>
                            <input 
                                type="number" 
                                id="cantidad" 
                                name="cantidad" 
                                placeholder="Cantidad de unidades" 
                                required 
                            />
                        </div>

                        {/* Proveedor */}
                        <div className="campo">
                            <label htmlFor="destinatario">Destinatario</label>
                            <input 
                                type="text" 
                                id="destinatario" 
                                name="destinatario" 
                                placeholder="Cliente o área de destino" 
                                required 
                            />
                        </div>

                        {/* Fecha de entrada */}
                        <div className="campo">
                            <label htmlFor="fecha">Fecha de salida</label>
                            <input 
                                type="date" 
                                id="fecha" 
                                name="fecha" 
                                required 
                            />
                        </div>

                        {/* Observaciones */}
                        <div className="campo">
                            <label htmlFor="observacion">Observaciones</label>
                            <textarea 
                                id="observacion" 
                                name="observacion" 
                                placeholder="Detalles adicionales..." 
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Botones de acción */}
                        <div className="botones">
                            <button type="submit" className="btn-guardar">
                                <i className="fa-solid fa-floppy-disk"></i> Guardar
                            </button>
                            <button type="reset" className="btn-cancelar">
                                <i className="fa-solid fa-xmark"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}