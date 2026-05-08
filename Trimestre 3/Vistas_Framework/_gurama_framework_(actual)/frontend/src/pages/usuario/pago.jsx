import React, { useState, useEffect, useRef, use } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/logica_carrito.jsx';
import Header from '../../components/Header_c.jsx';
import Footer from '../../components/Footer.jsx';

const API_URL = 'http://localhost:3001/api';

const TicketCompra = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('paymentData');
    const yaProcesado = sessionStorage.getItem('pedidoProcesado');
    
    if (storedData && !yaProcesado) {
      sessionStorage.setItem('pedidoProcesado', 'true');
      const data = JSON.parse(storedData);
      procesarVenta(data);
    }
  }, []);

  const procesarVenta = async (paymentData) => {
    setLoading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const id_usuario = userData.id_usuario || 'Adm-01';

      const metodoPagoMap = {
        'card': 'Mtd-TJ', 
        'nequi': 'Mtd-NQ',
        'daviplata': 'Mtd-DP'
      };

      // Llamar al nuevo endpoint que crea el pedido completo
      const response = await axios.post(`${API_URL}/pedidos/crear`, {
        items: paymentData.cartItems.map(item => ({
          id_producto: item.id,
          cantidad: item.cantidad,
          precio: item.price
        })),
        id_usuario,
        metodo_pago: metodoPagoMap[paymentData.paymentMethod],
        subtotal: paymentData.subtotal,
        total: paymentData.total
      });

      console.log(' Pedido creado:', response.data);

      // Generar datos del ticket con la respuesta del servidor
      const ticket = {
        num_ticket: `TKT-${response.data.data.num_ticket}`,
        id_pedido: response.data.data.id_pedido,
        fecha_emision: new Date().toLocaleString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        cliente: `${userData.nom_1 || 'Cliente'} ${userData.ape_1 || ''}`,
        id_usuario: userData.id_usuario,
        productos: paymentData.cartItems,
        subtotal: paymentData.subtotal,
        total: paymentData.total,
        metodo_pago: paymentData.paymentMethod === 'card' 
          ? 'Tarjeta de Crédito/Débito'
          : paymentData.paymentMethod === 'nequi'
          ? 'Nequi'
          : 'DaviPlata',
        detalles_pago: paymentData.paymentDetails,
        estado: 'Pagado'
      };

      setTicketData(ticket);
      sessionStorage.removeItem('paymentData');
      
      sessionStorage.removeItem('pedidoProcesado');

      clearCart();
      console.log(' Carrito limpiado después de la compra');

    } catch (error) {
      sessionStorage.removeItem('pedidoProcesado');
      console.error('Error al procesar la venta:', error);
      alert('Hubo un error al procesar la venta. Por favor contacte al administrador.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  const handleDescargar = () => {
    window.print();
  };

  const handleVolverInicio = () => {
    navigate('/cliente');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Procesando su compra...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">No hay información de compra</h2>
            <button
              onClick={handleVolverInicio}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Volver al Inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        
        <div ref={ticketRef} className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6 print:shadow-none">
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 text-center">
            <h1 className="text-3xl font-extrabold mb-2">¡Compra Exitosa!</h1>
            <p className="text-green-100">Su transacción ha sido procesada correctamente</p>
          </div>

          <div className="p-8 space-y-6">
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nº Ticket</p>
                  <p className="text-lg font-bold text-gray-900">{ticketData.num_ticket}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Nº Pedido</p>
                  <p className="text-lg font-bold text-gray-900">#{ticketData.id_pedido}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600">Fecha y Hora</p>
                <p className="text-base font-medium text-gray-900">{ticketData.fecha_emision}</p>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cliente</h3>
              <p className="text-gray-700 font-medium">{ticketData.cliente}</p>
              <p className="text-sm text-gray-600">ID: {ticketData.id_usuario}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos</h3>
              <div className="space-y-3">
                {ticketData.productos.map((producto, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{producto.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {producto.cantidad} × {formatPrice(producto.price)}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {formatPrice(producto.price * producto.cantidad)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatPrice(ticketData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-green-700 pt-2 border-t-2">
                <span>Total Pagado:</span>
                <span>{formatPrice(ticketData.total)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Método de Pago:</span>
                <span className="font-bold text-blue-900">{ticketData.metodo_pago}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Terminada en:</span>
                <span className="font-medium text-gray-800">**** {ticketData.detalles_pago.lastDigits}</span>
              </div>
              {ticketData.detalles_pago.cardHolder !== 'N/A' && (
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Titular:</span>
                  <span className="font-medium text-gray-800">{ticketData.detalles_pago.cardHolder}</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <span className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-full font-semibold">
                Estado: {ticketData.estado}
              </span>
            </div>

            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p className="font-medium">¡Gracias por su compra!</p>
              <p className="mt-1">Gurama Online - Productos Artesanales</p>
            </div>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <button
            onClick={handleDescargar}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <span></span>
            Descargar/Imprimir Ticket
          </button>
          
          <button
            onClick={handleVolverInicio}
            className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition shadow-lg flex items-center justify-center gap-2"
          >
            <span></span>
            Volver al Inicio
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default TicketCompra;