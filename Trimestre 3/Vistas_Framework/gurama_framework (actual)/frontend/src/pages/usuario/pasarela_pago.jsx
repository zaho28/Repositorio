import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header_c from '../../components/Header_c.jsx';
import "../../components/cliente.css";
import '../../components/pasarela.css';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);

  const orderAmount = '99.99 COP';
  const generateOrderId = () => `ORD-${Date.now().toString().slice(-6)}`;

  const { id } = useParams();

  useEffect(() => {
    console.log('Cargando formulario para la orden:', id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cvv)) {
      alert('Por favor, completa los campos de la tarjeta.');
      return;
    }
    if ((paymentMethod === 'nequi' || paymentMethod === 'daviplata') && !formData.phone) {
      alert('Por favor, ingresa tu número de teléfono.');
      return;
    }

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

  /* -------------------------------------------------- */
  /* CAMPOS SEGÚN EL MÉTODO DE PAGO                      */
  /* -------------------------------------------------- */
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
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19"
                onChange={handleChange}
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
                  placeholder="MM/AA"
                  maxLength="5"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  maxLength="4"
                  onChange={handleChange}
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
                placeholder="Nombre Apellido"
                onChange={handleChange}
                required
              />
            </div>
          </>
        );

      case 'nequi':
      case 'daviplata':
        return (
          <>
            <div className="form-group">
              <label htmlFor="phone">
                {paymentMethod === "nequi" ? "Número Nequi" : "Número DaviPlata"}
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="300 XXX XX XX"
                maxLength="10"
                onChange={handleChange}
                required
              />

              <p className="small-note">
                Será redirigido para confirmar la transacción.
              </p>
            </div>
          </>
        );

      default:
        return <p>Seleccione un método de pago.</p>;
    }
  };

  /* -------------------------------------------------- */
  /* RECIBO DE PAGO                                      */
  /* -------------------------------------------------- */
  const renderReceipt = () => {
    if (!receiptDetails) return null;

    const methodLabel = {
      card: 'Tarjeta de Crédito/Débito',
      nequi: 'Nequi',
      daviplata: 'DaviPlata'
    }[receiptDetails.method];

    return (
      <div className="receipt-container">
        <h2 className="receipt-success-title">¡Pago Exitoso!</h2>
        <p className="receipt-message">Su transacción ha sido procesada correctamente.</p>

        <div className="receipt-details">
          <div className="receipt-item">
            <span className="receipt-label">Monto Pagado:</span>
            <span className="receipt-value receipt-amount">{receiptDetails.amount}</span>
          </div>

          <div className="receipt-item">
            <span className="receipt-label">Transacción:</span>
            <span className="receipt-value">{receiptDetails.orderId}</span>
          </div>

          <div className="receipt-item">
            <span className="receipt-label">Método:</span>
            <span className="receipt-value">{methodLabel}</span>
          </div>

          <div className="receipt-item">
            <span className="receipt-label">Detalle:</span>
            <span className="receipt-value">Terminada en {receiptDetails.lastDigits}</span>
          </div>

          <div className="receipt-item">
            <span className="receipt-label">Fecha:</span>
            <span className="receipt-value">{receiptDetails.date}</span>
          </div>
        </div>

        <button className="receipt-button print-button" onClick={() => window.print()}>
          Imprimir Recibo
        </button>

        <Link to="/cliente" className="receipt-button new-payment-button">
          Volver al Inicio
        </Link>
      </div>
    );
  };

  return (
    <main className="contenido">
      <Header_c />

      <div className="payment-container">
        {!showReceipt ? (
          <>
            <h2>Checkout Seguro</h2>

            <form className="payment-form" onSubmit={handleSubmit}>

              {/* MÉTODO DE PAGO */}
              <div className="form-group">
                <label htmlFor="paymentMethod">Seleccione su método de pago</label>

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handleMethodChange}
                  className="select-method"
                >
                  <option value="card">Tarjeta de Crédito/Débito</option>
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">DaviPlata</option>
                </select>
              </div>

              {/* CAMPOS DINÁMICOS */}
              <div className="dynamic-fields">
                {renderPaymentFields()}
              </div>

              {/* BOTÓN PAGAR */}
              <button type="submit" className="pay-button">
                Pagar ${orderAmount}
              </button>

              <p className="security-note">
                Al continuar, acepta los Términos y Condiciones.
              </p>
            </form>
          </>
        ) : (
          renderReceipt()
        )}
      </div>
    </main>
  );
};

export default PaymentForm;
