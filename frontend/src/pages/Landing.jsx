import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LogoJankovic from "../assets/LogoJankovic.png";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const buttonHover = {
  scale: 1.05,
  textShadow: "0 0 8px rgb(221 33 41)",
  boxShadow: "0 0 15px rgb(221 33 41)",
};

export default function Landing() {
  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#dd2129] px-6 text-center select-none"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Logo */}
      <motion.img
        src={LogoJankovic}
        alt="Fast Food Janković Logo"
        className="w-32 h-32 sm:w-40 sm:h-40 mb-10 drop-shadow-lg"
        variants={itemVariants}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 130 }}
      />

      {/* Naslov */}
      <motion.h1
        className="text-5xl font-extrabold text-[#dd2129] dark:text-white mb-6"
        variants={itemVariants}
      >
        Rostilj Janković
      </motion.h1>

      {/* Slogan */}
      <motion.p
        className="text-lg text-gray-700 dark:text-white max-w-lg mx-auto mb-12"
        variants={itemVariants}
      >
        Najukusniji roštilj u gradu — brzo, sveže i online na dohvat ruke!
      </motion.p>

      {/* Dugme za Login */}
      <motion.div variants={itemVariants} className="w-full max-w-xs mx-auto">
        <Link
          to="/login"
          className="inline-block w-full bg-[#dd2129] hover:bg-red-700 text-white font-semibold py-3 px-12 rounded-full shadow-lg transition"
        >
          <motion.span
            whileHover={buttonHover}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ display: "inline-block" }}
          >
            Prijavi se
          </motion.span>
        </Link>
      </motion.div>

      {/* Link za registraciju */}
      <motion.p
        variants={itemVariants}
        className="mt-6 text-sm text-gray-700 dark:text-white font-semibold"
      >
        Još nemaš nalog?{" "}
        <Link
          to="/register"
          className="text-[#dd2129] hover:text-red-700 underline transition-colors duration-300"
        >
          Registruj se odmah
        </Link>
      </motion.p>
    </motion.main>
  );
}
