// src/components/ProductList.jsx
import { motion } from "framer-motion";
import testImg from "../assets/products/test.png";
import { useAuth } from "../context/AuthContext";
import { FaPen, FaTrash } from "react-icons/fa";

export default function ProductList({ items, error, onEdit, onDelete, onAddToCart }) {
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  if (error) {
    return (
      <p className="text-center text-red-600 font-semibold mt-6">
        Greška: {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 text-lg font-medium mt-6">
        Nema proizvoda koji zadovoljavaju kriterijume.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
          className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden flex items-center"
        >
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="bg-[#dd2129] text-white p-2 rounded-full hover:bg-[#b91c1c] transition"
                title="Izmeni proizvod"
              >
                <FaPen size={14} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
                    onDelete(item.id);
                  }
                }}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800 transition"
                title="Obriši proizvod"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}

          <img
            src={item.image || testImg}
            alt={item.name}
            className="w-32 h-28 object-cover rounded-l-3xl"
            loading="lazy"
          />

          <div className="p-4 flex-1 flex flex-col justify-center min-h-[130px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{item.description}</p>
            </div>

            <div className="mt-auto flex flex-col items-end gap-2">
              <p className="text-[#dd2129] font-semibold text-lg">{item.price} RSD</p>
              <button
                className="px-6 py-2 rounded-full text-white bg-[#dd2129] hover:bg-[#b91c1c] transition-colors duration-300 shadow-md cursor-pointer select-none"
                onClick={() => onAddToCart(item)}
              >
                Dodaj u korpu
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
