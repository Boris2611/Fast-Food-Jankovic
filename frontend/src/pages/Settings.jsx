import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaMoon, FaBell, FaLanguage, FaLock, FaCreditCard, FaTrash, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const settingsList = [
  {
    icon: <FaBell className="text-yellow-500" />,
    title: "Obaveštenja",
    subtitle: "Upravljaj obaveštenjima",
    key: "notifications",
    available: false,
  },
  {
    icon: <FaLanguage className="text-green-500" />,
    title: "Jezik",
    subtitle: "Promeni jezik aplikacije",
    key: "language",
    available: false,
  },
  {
    icon: <FaLock className="text-red-400" />,
    title: "Lozinka",
    subtitle: "Promeni lozinku",
    key: "password",
    available: false,
  },
  {
    icon: <FaCreditCard className="text-purple-500" />,
    title: "Plaćanje",
    subtitle: "Podešavanja plaćanja",
    key: "payment",
    available: false,
  },
  {
    icon: <FaTrash className="text-red-600" />,
    title: "Obriši nalog",
    subtitle: "Zauvek izbriši profil",
    key: "delete",
    available: false,
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Settings = () => {
  const { accent } = useTheme();
  // Uzimamo početnu temu iz localStorage ili podrazumevano "light"
  const [localTheme, setLocalTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Update klase dokumenta i localStorage kada se tema menja
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(localTheme);
    localStorage.setItem("theme", localTheme);
  }, [localTheme]);

  const toggleTheme = () => {
    setLocalTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <motion.div
      className={`min-h-screen px-6 py-10 bg-white dark:bg-gray-900 transition-colors duration-500`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2
        className="text-3xl font-extrabold text-center mb-10"
        style={{ color: accent }}
      >
        ⚙️ Podešavanja
      </h2>

      <div className="max-w-md mx-auto space-y-6">
        {/* Tema sa toggle switch */}
        <motion.div
          className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-transparent"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ borderColor: `${accent}33` }}
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl text-indigo-500">
              {localTheme === "light" ? <FaSun /> : <FaMoon />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tema
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Svetla / Tamna
              </p>
            </div>
          </div>

          <label
            htmlFor="theme-toggle"
            className="inline-flex relative items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id="theme-toggle"
              className="sr-only peer"
              checked={localTheme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#dd2129] dark:peer-focus:ring-[#dd2129] peer-checked:bg-[#dd2129] relative transition-colors duration-300"></div>
            <div
              className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow-md
                peer-checked:translate-x-6 transform transition-transform duration-300"
            />
          </label>
        </motion.div>

        {settingsList.map((setting, i) => (
          <motion.div
            key={setting.key}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            onClick={() => {
              if (!setting.available) return;
              // Dodaj funkcionalnosti po potrebi
            }}
            className={`flex items-center justify-between p-5 rounded-3xl cursor-pointer
              bg-gray-50 dark:bg-gray-800
              border border-transparent
              transition-colors duration-300
              ${!setting.available ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ borderColor: accent + "33" }}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{setting.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {setting.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {setting.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 bg-[#dd2129] hover:bg-[#b91c1c] text-white font-semibold py-3 px-6 rounded-3xl shadow-md transition duration-200 select-none mx-auto mt-6"
          whileTap={{ scale: 0.97 }}
          aria-label="Logout button"
          type="button"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Odjavi se</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Settings;
