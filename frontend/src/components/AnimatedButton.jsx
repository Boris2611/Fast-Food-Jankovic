import { motion } from "framer-motion";

export default function AnimatedButton({ onClick, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9, boxShadow: "0 0 8px rgba(221,33,41,0.7)" }}
      className="self-end mt-8 px-6 py-2 rounded-full text-white bg-[#dd2129] hover:bg-[#b91c1c] transition-colors duration-300 shadow-md cursor-pointer select-none"
    >
      {children}
    </motion.button>
  );
}
