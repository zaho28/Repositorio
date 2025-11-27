import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar_p-a";
import HeaderPanel from "../../components/HeaderPanel";
import "../../components/admin.css";

export default function Productos(){
    return(
        <div className="dashboard-layout">
           <Sidebar />

            <main className="contenido">
            <HeaderPanel />

            
                <main className="registro-container">
                    <form className="form-registro">
                        <div className="subtitulo">
                            <h2>Registrar Nuevo Usuario</h2>
                        </div>

                        <input 
                            type="text" 
                            id="nom-usuario" 
                            name="nom-usuario" 
                            placeholder="Ingrese el Nombre del Usuario" 
                            required 
                        />

                        <input 
                            type="email" placeholder="Ingrese el Email del Usuario" required 
                        />

                        <input 
                            type="tel" placeholder="Ingrese el Telefono del Usuario" required 
                        />

                        <select required>
                            <opcion value="">Seleccione el tipo de documento del Usuario</opcion>
                            <opcion value="CC">Cédula de Ciudadanía</opcion>
                            <opcion value="TI">Tarjeta de Identidad</opcion>
                            <opcion value="CE">Cédula de Extranjería</opcion>
                        </select>

                        <input type="text" placehaolder="ingrese el Número de documento" required />
                        <input type="password" placeholder="Ingrese la contraseña" required />
                        <input type="password" placeholder="Confirme la contraseña" required />

                        <button type="submit" className="btn-registrar">Registrar Usuario</button>
                    </form>
                </main>
            </main>
        </div>
    );
} 