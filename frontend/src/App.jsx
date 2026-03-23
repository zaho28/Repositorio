import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa logica de rutas protegidas, carrito y autenticacion
import { AuthProvider } from './context/AuthContext.jsx'; 
import { CartProvider } from './context/logica_carrito.jsx';
import RutasProtegidas from './context/RutasProtegidas.jsx';

// Pages públicas
import Index from './pages/inicio.jsx';
import Registro from './pages/registro.jsx';
import Login from './pages/login.jsx';
import LoginAdminCode from "./pages/LoginAdminCode.jsx";
import OlvidarContra from "./pages/olvidar_contrasena.jsx";
import Cambiar_contraseña from "./pages/cambiar_contrasena.jsx";
import Detalle_producto_i from "./pages/detalle_producto_i.jsx";

// Usuario
import Cliente from './pages/usuario/cliente.jsx';
import Catalogo_c from './pages/usuario/catalogo_c.jsx';
import Detalle_producto from './pages/usuario/detalle_producto.jsx';
import P_personalizados from './pages/usuario/pedidos_personalizados.jsx';
import P_sabanas from './pages/usuario/p_sabanas.jsx';
import P_cubrelecho from './pages/usuario/p_cubrelecho.jsx';
import Carrito from './pages/usuario/carrito.jsx';
import Perfil from './pages/usuario/perfil.jsx';
import Cambiar_datos from './pages/usuario/cambiar_datos.jsx';
import Ticketcompra from './pages/usuario/ticketcompra.jsx';

// Admin
import Panel_control from './pages/admin_Trabajador/panel_control.jsx';
import Productos from './pages/admin_Trabajador/productos.jsx';
import Editar_productos from './pages/admin_Trabajador/editar_productos.jsx';
import Movimientos from './pages/admin_Trabajador/movimientos.jsx';
import Entradas from './pages/admin_Trabajador/entradas.jsx';
import Salidas from './pages/admin_Trabajador/salidas.jsx';
import Usuarios from './pages/admin_Trabajador/usuarios.jsx';
import Pedidos_realizados from './pages/admin_Trabajador/pedidos_realizados.jsx';
import Registrar_usuarios from './pages/admin_Trabajador/registrar_usuario.jsx';
import Perfil_admin from './pages/admin_Trabajador/perfil_admin.jsx';
import Cambiardatos_a from './pages/admin_Trabajador/cambiar_datos-a.jsx'; 
import Registro_prod from "./pages/admin_Trabajador/registro_producto.jsx";
import Materiales from "./pages/admin_Trabajador/materiales.jsx";

function App() {
  return (
    <AuthProvider> 
      <CartProvider>
        <Router>
          <Routes>

            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} /> 
            <Route path="/admin-code" element={<LoginAdminCode />} />
            <Route path="/cambiar_contrasena" element={<Cambiar_contraseña />} />
            <Route path="/olvide_c" element={<OlvidarContra />} />
            <Route path="/d_producto/:id" element={<Detalle_producto_i />} />

            {/* Rutas Admin y Trabajador */}
            <Route path="/panel_control" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Panel_control />
              </RutasProtegidas>
            } />
            <Route path="/productos" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Productos />
              </RutasProtegidas>
            } />
            <Route path="/editar_productos/:id" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Editar_productos />
              </RutasProtegidas>
            } />
            <Route path="/movimientos" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Movimientos />
              </RutasProtegidas>
            } />
            <Route path="/entradas" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Entradas />
              </RutasProtegidas>
            } />
            <Route path="/salidas" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Salidas />
              </RutasProtegidas>
            } />
            <Route path="/pedidos_realizados" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Pedidos_realizados />
              </RutasProtegidas>
            } />
            <Route path="/perfil_admin" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Perfil_admin />
              </RutasProtegidas>
            } />
            <Route path="/cambiar_datos_a" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Cambiardatos_a />
              </RutasProtegidas>
            } />
            <Route path="/registro_prod" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Registro_prod />
              </RutasProtegidas>
            } />
            <Route path="/materiales" element={
              <RutasProtegidas rolesPermitidos={['1', '3']}>
                <Materiales />
              </RutasProtegidas>
            } />

            {/* Rutas solo ADMIN */}
            <Route path="/usuarios" element={
              <RutasProtegidas rolesPermitidos={['1']}>
                <Usuarios />
              </RutasProtegidas>
            } />
            <Route path="/registrar_usuario" element={
              <RutasProtegidas rolesPermitidos={['1']}>
                <Registrar_usuarios />
              </RutasProtegidas>
            } />

            {/* Rutas Cliente */}
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/catalogo_c" element={<Catalogo_c />} />
            <Route path="/producto/:id" element={<Detalle_producto />} />
            <Route path="/pedidos_personalizados" element={<P_personalizados />} />
            <Route path="/p_sabanas" element={<P_sabanas />} />
            <Route path="/p_cubrelecho" element={<P_cubrelecho />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cambiar_datos" element={<Cambiar_datos />} />
            <Route path="/ticket-compra" element={<Ticketcompra />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider> 
  );
}

export default App;