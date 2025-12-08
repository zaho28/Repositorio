import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
// Se mantienen las importaciones que no son usadas por convención, pero Link y useLocation se pueden eliminar.
// import { Link, useLocation } from 'react-router-dom'; 

import Header_c from "../../components/Header_c"; 
import "../../components/cliente.css"; // Archivo CSS sugerido

export default function PerfilFormSinSidebar() {
    return (  
        // Se elimina el div principal "dashboard-layout" y solo queda el contenedor principal del contenido.
        <main className="contenido">
            <Header_c />

            {/* Contenedor del formulario centrado */}
            <div className="perfil-container">
                <div className="form-card">
                    <h2 className="form-title">Cambiar datos</h2>
                    
                    <form>
                        {/* Nombre de usuario */}
                        <div className="form-group">
                            <input 
                                type="text" 
                                id="nombre_usuario" 
                                name="nombre_usuario" 
                                defaultValue="Maria Lopez" 
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="nombre_usuario">Nombre de usuario</label>
                        </div>

                        {/* Correo electrónico */}
                        <div className="form-group">
                            <input 
                                type="email" 
                                id="correo" 
                                name="correo" 
                                defaultValue="MariLz45@gmail.com" 
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="correo">Correo electrónico</label>
                        </div>

                        {/* Número telefónico */}
                        <div className="form-group">
                            <input 
                                type="tel" 
                                id="telefono" 
                                name="telefono" 
                                defaultValue="3287865455" 
                                placeholder=" " 
                                required 
                            />
                            <label htmlFor="telefono">Número telefónico</label>
                        </div>

                        {/* Grupo de Documento: Tipo (Select) y Número (Input) */}
                        <div className="document-group">
                            {/* Tipo de Documento (Select con opciones) */}
                            <div className="document-type">
                                <select 
                                    id="tipo_doc" 
                                    name="tipo_doc" 
                                    defaultValue="CC" 
                                    required
                                >
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="TI">Tarjeta de Identidad</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                </select>
                                <label htmlFor="tipo_doc">Tipo de documento</label>
                            </div>

                            {/* Número de documento */}
                            <div className="document-number">
                                <input 
                                    type="text" 
                                    id="numero_doc" 
                                    name="numero_doc" 
                                    defaultValue="1014937269" 
                                    placeholder=" " 
                                    required
                                />
                                <label htmlFor="numero_doc">N° documento</label>
                            </div>
                        </div>

                        {/* Botón Guardar */}
                        <button type="submit" className="btn-guardar">Guardar</button>
                    </form>
                </div>
            </div> 
        </main>
    );
}