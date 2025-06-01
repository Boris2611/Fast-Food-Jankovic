import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CartButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      aria-label="Korpa"
      title="Korpa"
      onClick={() => navigate("/cart")}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-[#dd2129] text-white shadow-lg cursor-pointer"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -5 }}
      animate={{
        scale: [1, 1.05, 1],
        transition: { repeat: Infinity, duration: 2 },
      }}
    >
      <FaShoppingCart size={24} />
    </motion.button>
  );
}
