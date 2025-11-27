import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 

//estilos
import "../../components/cliente.css";
//imagenes
import img_cliente from "../../assets/2.png";
// header y footer
import Header from '../../components/Header_c.jsx'; 
import Footer from '../../components/Footer.jsx'; 

const Cliente = () => {
    // 1. Inicializar el hook de navegación
    const navigate = useNavigate();
    // 2. Estado para guardar el texto escrito en la barra
    const [searchTerm, setSearchTerm] = useState('');

    // Maneja el cambio en el input (guarda el texto)
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Maneja la acción de búsqueda (clic o Enter)
    const handleSearch = () => {
        if (searchTerm.trim()) {
            // 3. Redirigir al catálogo, pasando el término de búsqueda
            // Usamos un query parameter (ej: /catalogo_c?search=tulipanes)
            navigate(`/catalogo_c?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    // Permite buscar al presionar Enter
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
        <Header />
        
        <main>
            <section className="buscador">
                <input 
                    type="text" 
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleInputChange} // Captura el texto
                    onKeyPress={handleKeyPress}  //  Permite buscar con Enter
                />
                <button onClick={handleSearch}>🔎</button> 
            </section>

            <section className="hero">
            <div className="hero-texto">
                <h1>Gurama</h1>
                <h3>Confecciones y pedidos</h3>
                <p>
                ¡Crea momentos especiales con nuestros<br/> 
                <span>amigurumis y sábanas personalizadas!</span>
                </p>
            </div>
            <div className="hero-imagen">
                <img src={img_cliente} alt="imagen" />
            </div>
            </section>

            <section className="promocion">
            <p>Sorprende a tus seres queridos con regalos únicos y hechos con amor</p>
            <Link to="/catalogo_c" className="boton-principal">Explora nuestro catálogo</Link>
            </section>
        </main>
        
        <Footer />
        </>
    );
};

export default Cliente;