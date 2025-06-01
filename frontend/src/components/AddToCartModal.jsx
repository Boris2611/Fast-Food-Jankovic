// src/components/AddToCartModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backdropVariants = {
  visible: { opacity: 1, transition: { duration: 0.25 } },
  hidden: { opacity: 0, transition: { duration: 0.25 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function AddToCartModal({
  productName,
  productImage,
  productPrice, // cena za jedan komad
  isOpen,
  onClose,
  onOrderNow,
  initialQuantity = 1,
  onQuantityChange,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    if (isOpen) setQuantity(initialQuantity);
  }, [isOpen, initialQuantity]);

  const increment = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange && onQuantityChange(newQty);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange && onQuantityChange(newQty);
    }
  };

  // Ukupna cena za prikaz
  const totalPrice = productPrice * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-xs w-full shadow-2xl relative text-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zatvori dugme */}
            <button
              aria-label="Zatvori"
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition text-3xl leading-none"
            >
              &times;
            </button>

            {/* Slika proizvoda */}
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="mx-auto mb-5 rounded-2xl w-28 h-28 object-cover shadow-md"
              />
            )}

            {/* Naziv, ukupna cena, količina */}
            <div className="flex flex-col items-center gap-1 mb-6">
              <p className="text-xl font-semibold dark:text-white truncate max-w-[220px]">
                {productName}
              </p>
              <p className="text-[#dd2129] font-semibold text-lg">
                {totalPrice.toLocaleString("sr-RS")} RSD
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Količina: {quantity}
              </p>
            </div>

            {/* Kontrole količine */}
            <div className="flex justify-center items-center gap-5 mb-8">
              <button
                onClick={decrement}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center text-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition select-none"
                aria-label="Smanji količinu"
              >
                &minus;
              </button>
              <span className="text-lg font-semibold dark:text-white select-none">
                {quantity}
              </span>
              <button
                onClick={increment}
                className="w-10 h-10 rounded-full bg-[#dd2129] text-white flex items-center justify-center text-2xl font-bold hover:bg-[#b91c1c] transition select-none"
                aria-label="Povećaj količinu"
              >
                +
              </button>
            </div>

            {/* Dugmad */}
            <div className="flex flex-col gap-4">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Nastavi naručivanje
              </button>
              <button
                onClick={() => onOrderNow(quantity)}
                className="w-full px-6 py-3 rounded-full bg-[#dd2129] text-white font-semibold hover:bg-[#b91c1c] transition"
              >
                Naruči sada
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
