// src/pages/Login.jsx (ili gde ti je Login komponenta)
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BACKEND_URL } from "../config";  // importujemo URL iz config-a

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      login(token); // ⬅️ poziva i setuje u localStorage

      setMessage("Uspešno ste se prijavili!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage("Pogrešan email ili lozinka.");
      } else {
        setMessage("Greška prilikom prijave.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 transition-colors duration-500">
      <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
          Prijava
        </h2>

        {message && (
          <div
            className={`mb-6 text-sm font-medium text-center py-2 px-4 rounded ${
              message.includes("Uspešno")
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-3 dark:bg-gray-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
              Lozinka
            </label>
            <input
              type="password"
              className="w-full rounded-xl border px-4 py-3 dark:bg-gray-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#dd2129] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            Prijavi se
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Nemate nalog?{" "}
          <Link to="/register" className="text-[#dd2129] hover:text-[#b91c1c] font-semibold">
            Registrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}
