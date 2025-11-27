import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header_c from '../../components/Header_c.jsx'; 
import "../../components/cliente.css"; 
// ✅ RUTA CORREGIDA: Asumiendo que el CSS está en src/components/
import '../../components/pasarela.css'; 

const PaymentForm = () => {
  // Estados
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({});
  const [showReceipt, setShowReceipt] = useState(false); 
  const [receiptDetails, setReceiptDetails] = useState(null);

  // Datos fijos para el ejemplo
  const orderAmount = '99.99 COP';
  const generateOrderId = () => `ORD-${Date.now().toString().slice(-6)}`;

  // Hooks de React Router
  const { id } = useParams();
  useEffect(() => {
    console.log('Cargando formulario para la orden:', id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cvv)) {
            alert('Por favor, completa los campos de la tarjeta.');
            return;
        }
    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !formData.phone) {
            alert('Por favor, ingresa tu número de teléfono.');
            return;
    }

    // Suponemos que el pago fue exitoso:
    const paymentSuccessData = {
      orderId: generateOrderId(),
      amount: orderAmount,
      method: paymentMethod,
      date: new Date().toLocaleString('es-ES'),
      lastDigits: formData.cardNumber 
            ? formData.cardNumber.slice(-4) 
            : formData.phone 
            ? formData.phone.slice(-4) 
            : 'N/A',
      isSuccessful: true
    };

    setReceiptDetails(paymentSuccessData);
    setShowReceipt(true);
  };

  /**
   * FUNCIÓN PARA RENDERIZAR LOS CAMPOS DEL FORMULARIO DE PAGO
   */
  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <>
            <div className="form-group">
              <label htmlFor="cardNumber">Número de Tarjeta</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="expiryDate">Fecha de Vencimiento (MM/AA)</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  onChange={handleChange}
                  placeholder="MM/AA"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cardHolderName">Nombre del Titular</label>
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                onChange={handleChange}
                placeholder="Nombre Apellido"
                required
              />
            </div>
          </>
        );

      case 'nequi':
      case 'daviplata':
        const labelText = paymentMethod === 'nequi' ? 'Número Nequi' : 'Número DaviPlata';
        const placeholderText = paymentMethod === 'nequi' ? '300 XXX XX XX' : '300 XXX XX XX';
        
        return (
          <>
            <div className="form-group">
              <label htmlFor="phone">{labelText}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                onChange={handleChange}
                placeholder={placeholderText}
                maxLength="10"
                required
              />
              <p className="small-note">
                Serás redirigido a la aplicación móvil o web para confirmar la transacción.
              </p>
            </div>
          </>
        );

      default:
        return <p>Selecciona un método de pago.</p>;
    }
  };

  /**
   * FUNCIÓN PARA RENDERIZAR EL TICKET DE COMPRA
   */
  const renderReceipt = () => {
    if (!receiptDetails) return null;

    const methodDisplay = {
        card: 'Tarjeta de Crédito/Débito',
        nequi: 'Nequi',
        daviplata: 'DaviPlata'
    }[receiptDetails.method];

    return (
      <div className="receipt-container">
        <h2 className="receipt-success-title">✅ ¡Pago Exitoso!</h2>
        <p className="receipt-message">Tu transacción ha sido procesada correctamente.</p>
        
        <div className="receipt-details">
            <div className="receipt-item">
                <span className="receipt-label">Monto Pagado:</span>
                <span className="receipt-value receipt-amount">{receiptDetails.amount}</span>
            </div>
            <div className="receipt-item">
                <span className="receipt-label">No. de Transacción:</span>
                <span className="receipt-value">{receiptDetails.orderId}</span>
            </div>
            <div className="receipt-item">
                <span className="receipt-label">Método de Pago:</span>
                <span className="receipt-value">{methodDisplay}</span>
            </div>
            <div className="receipt-item">
                <span className="receipt-label">Detalle:</span>
                <span className="receipt-value">Terminado en {receiptDetails.lastDigits}</span>
            </div>
            <div className="receipt-item">
                <span className="receipt-label">Fecha y Hora:</span>
                <span className="receipt-value">{receiptDetails.date}</span>
            </div>
        </div>

        <button 
            className="receipt-button print-button" 
            onClick={() => window.print()}
        >
            🖨️ Imprimir Recibo
        </button>
        <Link 
            className="receipt-button new-payment-button" 
            to="/"
        >
            Volver a Inicio
        </Link>
      </div>
    );
  };


  // --- LÓGICA PRINCIPAL DE RENDERIZADO ---
  return (
    <main className="contenido">
        <Header_c /> 
        
        <div className="payment-container">
          {showReceipt ? (
            renderReceipt()
          ) : (
            <>
                <h2>💸 Checkout Seguro</h2>
                <form className="payment-form" onSubmit={handleSubmit}>

                    {/* --- SELECCIÓN DEL MÉTODO DE PAGO --- */}
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Selecciona tu método de pago</label>
                        <select 
                            id="paymentMethod" 
                            name="paymentMethod" 
                            value={paymentMethod} 
                            onChange={handleMethodChange}
                            className="select-method"
                        >
                            <option value="card">💳 Tarjeta de Crédito/Débito</option>
                            <option value="nequi">📲 Nequi</option>
                            <option value="daviplata">🧡 DaviPlata</option>
                        </select>
                    </div>

                    {/* --- CAMPOS DINÁMICOS --- */}
                    <div className="dynamic-fields">
                        {renderPaymentFields()}
                    </div>

                    <button type="submit" className="pay-button">
                        Pagar ${orderAmount}
                    </button>

                    <p className="security-note">
                        🔒 Al continuar, aceptas los Términos y Condiciones.
                    </p>
                </form>
            </>
          )}
        </div>
    </main>
  );
};

export default PaymentForm;