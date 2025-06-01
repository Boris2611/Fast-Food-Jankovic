import { FiHome, FiUser, FiClock, FiSettings } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BottomNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    { to: "/home", icon: <FiHome size={24} />, name: "Početna" },
    {
      to: isAdmin ? "/admin/AdminOrders" : "/order-status",
      icon: <FiClock size={24} />,
      name: isAdmin ? "Porudžbine" : "Status",
    },
    { to: "/profile", icon: <FiUser size={24} />, name: "Profil" },
    { to: "/settings", icon: <FiSettings size={24} />, name: "Podešavanja" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-xl rounded-full px-8 py-3 flex justify-between items-center w-[90%] max-w-md z-50 border border-gray-300 dark:border-gray-700 transition-all duration-300">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`relative p-3 transition-all duration-300 rounded-full flex items-center justify-center ${
              isActive
                ? "bg-[#dd2129] text-white shadow-lg scale-110"
                : "text-gray-400 dark:text-gray-500"
            }`}
            aria-label={item.name}
            title={item.name}
          >
            {item.icon}
            <span className="sr-only">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;
