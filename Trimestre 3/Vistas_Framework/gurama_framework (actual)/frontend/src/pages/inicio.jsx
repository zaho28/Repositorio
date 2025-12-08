import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../components/cliente.css";
import img from "../assets/2.png";

import Headeri from "../components/Header.jsx";
import Footer from '../components/Footer.jsx'; 

const API_URL = "http://localhost:3001/api/productos";

function Inicio() {
  const navigate = useNavigate();
  const [mostrarVentana, setMostrarVentana] = useState(false);
  
  // Estados para productos
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Mostrar ventana emergente al cargar
  useEffect(() => {
    setMostrarVentana(true);
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setCargando(true);
        const response = await axios.get(API_URL);
        const productosAPI = response.data;
        
        // Filtrar solo productos disponibles (con stock)
        const productosDisponibles = productosAPI.filter(p => p.stock_actual > 0);
        
        // Tomar solo los primeros 12 productos para mostrar en inicio
        setProducts(productosDisponibles.slice(0, 12));
        setError(null);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos");
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  // Función para obtener la URL de la imagen
  const getImageUrl = (rutaImagen) => {
    if (!rutaImagen) return 'https://via.placeholder.com/200x200?text=Sin+Imagen';
    return `http://localhost:3001${rutaImagen}`;
  };

  // Función para determinar si el stock es bajo
  const isStockBajo = (producto) => {
    return producto.stock_actual <= producto.stock_minimo;
  };

  // Función para obtener el badge del producto
  const getBadgeInfo = (producto) => {
    // Stock bajo 
    if (isStockBajo(producto) && producto.stock_actual > 0) {
      return {
        texto: 'Últimas Unidades',
        color: '#f88787ff',
        mostrar: true
      };
    }

    // Clasificación de la BD (solo si NO es "Sin clasificar")
    if (producto.nombre_clas) {
      const clasificacion = producto.nombre_clas.toLowerCase();

      // NO mostrar badge si es "Sin clasificar"
      if (clasificacion === 'sin clasificar') {
        return { mostrar: false };
      }

      if (clasificacion === 'nuevo' || clasificacion === 'nuevos') {
        return { texto: 'Nuevo', color: '#33f321ff', mostrar: true };
      }
      if (clasificacion === 'en oferta' || clasificacion === 'oferta') {
        return { texto: 'En Oferta', color: '#ec9614ff', mostrar: true };
      }
      if (clasificacion.includes('vendido') || clasificacion === 'mas vendidos') {
        return { texto: 'Más Vendido', color: '#0b87ecff', mostrar: true };
      }
      if (clasificacion === 'ultimas unidades') {
        return { texto: 'Últimas Unidades', color: '#eb54bdff', mostrar: true };
      }
      
      // Clasificación personalizada
      return { texto: producto.nombre_clas, color: '#bbbbbbff', mostrar: true };
    }

    return { mostrar: false };
  };

  // Manejar clic en "Ver ofertas" - redirige a login con parámetro
  const handleVerOfertas = () => {
    setMostrarVentana(false);
    navigate('/login?redirect=catalogo&filter=oferta');
  };

  // Manejar clic en producto - redirige a login
  const handleProductClick = (e, idProducto) => {
    e.preventDefault();
    navigate(`/login?redirect=producto&id=${idProducto}`);
  };

  return (
    <>
      <Headeri />

      {/* CONTENIDO */}
      <main>
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
            <img src={img} alt="imagen" />
          </div>
        </div>

        <div className="franja-gris">
          <p>Sorprende a tus seres queridos con regalos únicos y hechos con amor</p>
        </div>

        {/* CATALOGO */}
        <section className="catalogo-inicio">
          <h2>Catálogo</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
            Inicia sesión para ver todos nuestros productos y realizar compras
          </p>

          <div className="hero-blanco">
            <div className="hero-contenido">
              {cargando ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Cargando productos...</p>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="contenedor-productos">
                  {products.map((product) => {
                    const badgeInfo = getBadgeInfo(product);
                    
                    return (
                      <a 
                        key={product.id_producto}
                        href="#" 
                        onClick={(e) => handleProductClick(e, product.id_producto)}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div className="producto">
                          {/* Badge de Clasificación */}
                          {badgeInfo.mostrar && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              backgroundColor: badgeInfo.color,
                              color: 'white',
                              zIndex: 1,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              animation: badgeInfo.texto.includes('Últimas') ? 'pulse 2s infinite' : 'none'
                            }}>
                              {badgeInfo.texto}
                            </div>
                          )}

                          {product.ruta_imagen ? (
                            <img 
                              src={getImageUrl(product.ruta_imagen)} 
                              alt={product.nom_producto}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x200?text=Sin+Imagen';
                              }}
                            />
                          ) : (
                            <img 
                              src="https://via.placeholder.com/200x200?text=Sin+Imagen" 
                              alt="Sin imagen"
                            />
                          )}
                          
                          <p><strong>{product.nom_producto}</strong></p>
                          <p style={{ 
                            color: '#666', 
                            fontSize: '14px',
                            marginBottom: '8px'
                          }}>
                            {product.nombre_c}
                          </p>
                          
                          <p className="precio">${parseFloat(product.precio_unitario).toLocaleString('es-CO')}</p>
                          
                          {/* Indicador de stock */}
                          {product.stock_actual > 0 ? (
                            isStockBajo(product) ? (
                              <span style={{
                                display: 'inline-block',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                backgroundColor: '#fff3cd',
                                color: '#856404',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                marginTop: '8px'
                              }}>
                                Pocas unidades
                              </span>
                            ) : (
                              <span className="disponible">Disponible</span>
                            )
                          ) : (
                            <span className="agotado">Agotado</span>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Botón para ver catálogo completo */}
              {!cargando && !error && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <Link to="/login?redirect=catalogo">
                    <button className="btn-carrito" style={{
                      padding: '15px 40px',
                      fontSize: '16px'
                    }}>
                      Ver catálogo completo
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>

      {/* VENTANA EMERGENTE DE OFERTAS */}
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

            <img 
              src={products.length > 0 && products[0].ruta_imagen 
                ? getImageUrl(products[0].ruta_imagen) 
                : "/imagenes/1.png"
              } 
              alt="Amigurumi en promoción" 
              style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '15px' }}
            />

            <button 
              onClick={handleVerOfertas}
              className="boton-ver"
              style={{ marginTop: '20px' }}
            >
              Ver ofertas
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Inicio;