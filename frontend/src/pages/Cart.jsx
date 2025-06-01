import React from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { BACKEND_URL } from "../config"; // importuj backend url

export default function Cart() {
  const {
    cartItems,
    incrementQty,
    decrementQty,
    removeItem,
    totalPrice = 0,
    clearCart,
  } = useCart();

  const { token } = useAuth();

  const handleOrder = async () => {
    if (!token) {
      alert("Prijavite se da biste poručili.");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/orders`,
        {
          items: cartItems.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Porudžbina uspešno kreirana!");
      clearCart();
    } catch (error) {
      console.error("❌ Greška pri poručivanju:", error);
      alert(
        `Greška pri slanju porudžbine: ${
          error.response?.status
            ? error.response.status + " - " + error.response.data
            : error.message
        }`
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-white dark:bg-gray-900">
        <h2 className="text-xl font-semibold">🛒 Prazna korpa</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6">
      <h1 className="text-xl font-bold text-center mb-4">Korpa</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-3 shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 object-cover rounded-xl"
            />
            <div className="flex-1 px-2">
              <h3 className="text-md font-medium leading-tight">{item.name}</h3>
              <p className="text-sm text-[#dd2129] font-semibold">
                {item.price} RSD
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => decrementQty(item.id)}
                className="p-1 bg-gray-300 dark:bg-gray-700 rounded-full"
              >
                <FaMinus className="text-xs" />
              </button>
              <span className="w-5 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => incrementQty(item.id)}
                className="p-1 bg-gray-300 dark:bg-gray-700 rounded-full"
              >
                <FaPlus className="text-xs" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 bg-red-600 text-white rounded-full"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-lg font-semibold">
        <span>Ukupno:</span>
        <span className="text-[#dd2129]">
          {totalPrice?.toFixed(2) ?? "0.00"} RSD
        </span>
      </div>

      <button
        onClick={handleOrder}
        className="mt-6 w-full py-3 bg-[#dd2129] text-white rounded-2xl font-bold text-lg shadow hover:bg-red-700 transition"
      >
        Pošalji
      </button>
    </div>
  );
}
