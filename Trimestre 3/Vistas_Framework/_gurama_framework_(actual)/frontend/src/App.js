import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Importa el AuthProvider
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/logica_carrito.jsx';

//Pages
import Index from './pages/inicio.jsx';
import Registro from './pages/registro.jsx';
import Login from './pages/login.jsx';
import LoginAdminCode from "./pages/LoginAdminCode";
import OlvidarContra from "./pages/olvidar_contrasena.jsx";
import Cambiar_contraseña1 from "./pages/cambiar_contraseña1";
import Detalle_producto_i from "./pages/detalle_producto_i.jsx";

//usuario 
import Cliente from './pages/usuario/cliente.jsx';
import Catalogo_c from './pages/usuario/catalogo_c.jsx';
import Detalle_producto from './pages/usuario/detalle_producto.jsx';
import P_personalizados from './pages/usuario/pedidos_personalizados.jsx';
import P_sabanas from './pages/usuario/p_sabanas.jsx';
import P_cubrelecho from './pages/usuario/p_cubrelecho.jsx';
import Carrito from './pages/usuario/carrito.jsx';
import Perfil from './pages/usuario/perfil.jsx';
import Cambiar_datos from './pages/usuario/cambiar_datos.jsx'
import Cambiar_contraseña2 from './pages/usuario/cambiar_contraseña2.jsx'
import Pasarelapagos from './pages/usuario/pasarela_pago.jsx'
import Ticketcompra from './pages/usuario/pago.jsx'

//admin
import Panel_control from './pages/admin/panel_control.jsx';
import Historial_ventas from './pages/admin/historial_ventas.jsx';
import Productos from './pages/admin/productos.jsx';
import Editar_productos from './pages/admin/editar_productos.jsx';
import Movimientos from './pages/admin/movimientos.jsx';
import Entradas from './pages/admin/entradas.jsx';
import Salidas from './pages/admin/salidas.jsx';
import Usuarios from './pages/admin/usuarios.jsx';
import Pedidos_realizados from './pages/admin/pedidos_realizados.jsx';
import Registrar_usuarios from './pages/admin/registrar_usuario.jsx';
import Notificaciones from './pages/admin/notificaciones.jsx';
import Perfil_admin from './pages/admin/perfil_admin.jsx';
import Cambiardatos_a from './pages/admin/cambiar_datos-a.jsx'; 
import Registro_prod from "./pages/admin/registro_producto.jsx";
import Cambiar_contr3 from "./pages/admin/cambiar_contraseña3.jsx";
import Reportes from "./pages/admin/reportes.jsx";

function App() {
  return (

    <AuthProvider> 
      <CartProvider>
        <Router>
          <Routes>

            {/*Index*/}
            <Route path="/" element={<Index />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-code" element={<LoginAdminCode />} />
            <Route path="/cambiar_contraseña1" element={<Cambiar_contraseña1 />} />
            <Route path="/olvide_c" element={<OlvidarContra />} />
            <Route path="/d_producto/:id" element={<Detalle_producto_i />} />

            {/*Admin*/} 
            <Route path="/panel_control" element={<Panel_control />} />
            <Route path="/historial_ventas" element={<Historial_ventas />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/editar_productos/:id" element={<Editar_productos />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/salidas" element={<Salidas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/pedidos_realizados" element={<Pedidos_realizados />} />
            <Route path="/registrar_usuario" element={<Registrar_usuarios />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/perfil_admin" element={<Perfil_admin />} />
            <Route path="/cambiar_datos_a" element={<Cambiardatos_a />} />
            <Route path="/cambiar_contra3" element={<Cambiar_contr3 />} />
            <Route path="/reportes" element={<Reportes />} />            
            
            {/*Usuario*/}
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/catalogo_c" element={<Catalogo_c />} />
            <Route path="/producto/:id" element={<Detalle_producto />} />
            <Route path="/pedidos_personalizados" element={<P_personalizados/>}/>
            <Route path="/p_sabanas" element={<P_sabanas/>}/>
            <Route path="/p_cubrelecho" element={<P_cubrelecho/>}/>
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/registro_prod" element={<Registro_prod />} />
            <Route path="/cambiar_datos" element={<Cambiar_datos />} />
            <Route path="/cambiar_contraseña2" element={<Cambiar_contraseña2 />} />
            <Route path="/pasarela-pago" element={<Pasarelapagos />} />
            <Route path="/ticket-compra" element={<Ticketcompra />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider> 
  );
}
export default App;