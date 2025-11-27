// pages/Inicio.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/cliente.css";



import Headeri from "../components/Header.jsx";
import Footer from '../components/Footer.jsx'; 

function Inicio() {
  const [mostrarVentana, setMostrarVentana] = useState(false);

  useEffect(() => {
    setMostrarVentana(true); // Mostrar ventana al cargar
  }, []);

  return (
    <>
        <Headeri />

      {/* CONTENIDO */}
      <main>

        <Link to="/cliente" className="boton-principal">CLIENTE</Link>        
        <Link to="/panel_control"className="boton-principal">ADMIN</Link>

        <div className="hero">
          <div className="hero-texto">
            <div className="titulo_principal">
              <h1>Gurama</h1>
              <h2>Confecciones y pedidos</h2>
            </div>

            <div className="subtitulo">
              <h2>
                <span className="subtitulo-parte1">¡Crea momentos especiales con nuestros </span>
                <span className="subtitulo-parte2">amigurumis y sábanas personalizadas!</span>
              </h2>
            </div>
          </div>

          <div className="hero-imagen">
            <img src="/imagenes/2.png" alt="Ramo de tulipanes tejidos destacada" />
          </div>
        </div>

        <div className="franja-gris">
          <p>Sorprende a tus seres queridos con regalos únicos y hechos con amor</p>
        </div>

        {/* CATALOGO */}
        <section className=".catalogo-inicio">
          <h2>Catálogo</h2>

          <div className="hero-blanco">
            <div className="hero-contenido">
              <div className="productos">

                {[...Array(30)].map((_, i) => {
                  const id = i + 1;
                  return (
                    <a key={id} href={`/vistas/producto.html?id=${id}`}>
                      <div className="producto">
                        <img src={`/imagenes/${id}.png`} alt={`Producto ${id}`} />
                        <p>Producto {id}</p>
                      </div>
                    </a>
                  );
                })}

              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
      {/* VENTANA EMERGENTE */}
      {mostrarVentana && (
        <div id="ventana" className="ventana" style={{ display: "flex" }}>
          <div className="ventana-contenido">
            <span className="cerrar" onClick={() => setMostrarVentana(false)}>
              &times;
            </span>

            <h2>¡Descubre nuestras ofertas en amigurumis!</h2>
            <p>Dale un toque tierno y único a tu mundo con nuestros amigurumis hechos a mano.</p>
            <p>Hasta 30% de descuento en modelos seleccionados.</p>
            <p>Hechos con amor, perfectos para regalar o coleccionar.</p>

            <img src="/imagenes/1.png" alt="Amigurumi en promoción" />

            <a href="#" className="boton-ver">
              Ver ofertas
            </a>
          </div>
        </div>
      )}
    </>
  );
}


export default Inicio;