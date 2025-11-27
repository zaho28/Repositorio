<Link to="/pago">
    <button
        disabled={resumenCompra.subtotalNumber === 0}
        className={`finalizar w-full py-3 rounded-xl font-bold text-lg transition shadow-lg ${
            resumenCompra.subtotalNumber > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
    >
        Ir a pagar
    </button>
</Link>
import React from "react";
import { useCart } from "../../context/logica_carrito.jsx";
import Header from "../../components/Header_c.jsx";
import Footer from "../../components/Footer.jsx";

const Pago = () => {
  const { cartItems, clearCart } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.cantidad,
    0
  );

  const formatPrice = (price) =>
    price.toLocaleString("es-CO", { style: "currency", currency: "COP" });

  const handlePagoTransferencia = () => {
    alert("Se generará la información de pago por transferencia");
    clearCart(); // solo si quieres vaciar el carrito después
  };

  const handlePagoContraentrega = () => {
    alert("Has elegido pagar contra entrega");
    clearCart();
  };

  const handlePagoMercadoPago = () => {
    alert("Aquí conectaríamos Mercado Pago");
  };

  return (
    <div className="app-container">
      <Header />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6">Métodos de Pago</h1>

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">

          <p className="text-xl">
            Total a pagar:{" "}
            <span className="font-bold text-red-600">{formatPrice(total)}</span>
          </p>

          {/* Métodos de pago */}
          <div className="space-y-4">

            {/* Transferencia */}
            <button
              onClick={handlePagoTransferencia}
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold hover:bg-blue-700"
            >
              Transferencia bancaria / Nequi
            </button>

            {/* Contra entrega */}
            <button
              onClick={handlePagoContraentrega}
              className="w-full bg-orange-600 text-white p-4 rounded-xl font-semibold hover:bg-orange-700"
            >
              Pago contra entrega
            </button>

            {/* Mercado Pago */}
            <button
              onClick={handlePagoMercadoPago}
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold hover:bg-indigo-700"
            >
              Pagar con Mercado Pago
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pago;
import Pago from "./pages/usuario/pago.jsx";

<Route path="/pago" element={<Pago />} />
