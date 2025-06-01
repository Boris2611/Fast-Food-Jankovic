import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaHistory, FaRedo } from "react-icons/fa";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Niste ulogovani.");
      setLoading(false);
      return;
    }
    axios
      .get(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Greška pri dohvatanju podataka.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <span className="text-gray-700 dark:text-gray-200 text-lg animate-pulse">
          Učitavanje...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900 px-4 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 pb-16 pt-10 flex flex-col items-center transition-colors duration-500">
      {/* Sad je ceo sadržaj direktno u ovom div-u */}

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 130 }}
        >
          <FaUserCircle className="text-[72px] sm:text-[88px] text-[#dd2129] dark:text-[#faa91a] mb-3" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-[#dd2129] dark:text-[#faa91a]">
          Moj profil
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs uppercase tracking-wide font-semibold">
          Podaci o korisniku
        </p>
      </div>

      {/* User info */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
        {[
          { label: "Ime", value: user.name },
          { label: "Email", value: user.email },
          { label: "Telefon", value: user.phone },
          { label: "Uloga", value: user.role },
          {
            label: "Verifikovan",
            value: user.verified ? "Da ✅" : "Ne ❌",
            colSpan: "sm:col-span-2",
          },
        ].map(({ label, value, colSpan }, i) => (
          <motion.div
            key={i}
            className={`bg-transparent rounded-lg border border-gray-300 dark:border-gray-600 p-4 flex flex-col justify-center ${
              colSpan ?? ""
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 font-semibold mb-1 select-text">
              {label}
            </p>
            <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 break-words select-text">
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Order history */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-[#dd2129] dark:text-[#faa91a] mb-5 flex items-center gap-2 select-none">
          <FaHistory /> Istorija porudžbina
        </h2>

        <div className="space-y-4">
          {[1, 2].map((order, idx) => (
            <motion.div
              key={order}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm flex justify-between items-center border border-gray-300 dark:border-gray-600"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.15 }}
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-base select-text">
                  #Porudžbina {order}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 select-text">
                  12. maj 2025. · 3 proizvoda
                </p>
              </div>
              <motion.button
                className="bg-[#dd2129] hover:bg-[#faa91a] hover:text-[#dd2129] text-white px-4 py-1 rounded-full transition-shadow duration-300 shadow-sm flex items-center gap-1 select-none text-sm font-semibold"
                disabled
                whileTap={{ scale: 0.95, opacity: 0.85 }}
                title="Opcija nije dostupna"
              >
                <FaRedo className="text-sm" /> Ponovi
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
