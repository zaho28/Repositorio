import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/logica_carrito.jsx';

const PasarelaPago = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Calcular totales
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price * item.cantidad), 
    0
  );
  const total = subtotal;

  const formatPrice = (price) => price.toLocaleString('es-CO');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cvv)) {
      alert('Por favor, completa los campos de la tarjeta.');
      return;
    }
    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !formData.phone) {
      alert('Por favor, ingresa tu número de teléfono.');
      return;
    }

    setLoading(true);

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Preparar datos para el ticket
      const paymentData = {
        cartItems,
        subtotal,
        total,
        paymentMethod,
        paymentDetails: {
          lastDigits: formData.cardNumber 
            ? formData.cardNumber.slice(-4) 
            : formData.phone 
            ? formData.phone.slice(-4) 
            : 'N/A',
          cardHolder: formData.cardHolderName || 'N/A'
        },
        timestamp: new Date().toISOString()
      };

      // Guardar en sessionStorage para el ticket
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Navegar al ticket
    navigate('/ticket-compra');
      } catch (error) {
        console.error('Error procesando el pago:', error);
        alert('Hubo un error al procesar el pago. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Tarjeta</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Vencimiento (MM/AA)</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/AA"
                  maxLength="5"
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="123"
                  maxLength="4"
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Titular</label>
              <input
                type="text"
                name="cardHolderName"
                placeholder="Nombre Apellido"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>
        );

      case 'nequi':
      case 'daviplata':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">
              {paymentMethod === "nequi" ? "Número Nequi" : "Número DaviPlata"}
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="300 123 4567"
              maxLength="10"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Serás redirigido para confirmar la transacción.
            </p>
          </div>
        );

      default:
        return <p>Seleccione un método de pago.</p>;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
          <p className="text-gray-600 mb-6">No hay productos para procesar el pago</p>
          <Link to="/catalogo_c" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Checkout Seguro
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario de pago */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Seleccione su método de pago
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={handleMethodChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="card">Tarjeta de Crédito/Débito</option>
                    <option value="nequi">Nequi</option>
                    <option value="daviplata">DaviPlata</option>
                  </select>
                </div>

                {renderPaymentFields()}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Procesando...' : `Pagar $${formatPrice(total)}`}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Transacción segura y protegida
                </p>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4"> Resumen</h3>
              
              <div className="space-y-3 border-b pb-4 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">x {item.cantidad}</p>
                    </div>
                    <span className="font-medium">
                      ${formatPrice(item.price * item.cantidad)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-medium">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-green-600 pt-2 border-t">
                  <span>Total:</span>
                  <span>${formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PasarelaPago;