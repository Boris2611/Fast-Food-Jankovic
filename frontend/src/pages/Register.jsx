import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";  // importuj BACKEND_URL

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {  // koristi BACKEND_URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Uspešna registracija! Možete se prijaviti.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorText = await response.text();
        setMessage(errorText || "Greška prilikom registracije!");
      }
    } catch {
      setMessage("Greška prilikom registracije!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 transition-colors duration-500">
      <form
        className="bg-gray-50 dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
          Registracija
        </h2>

        {message && (
          <div
            className={`mb-6 text-sm font-medium text-center py-2 px-4 rounded ${
              message.includes("Uspešna")
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            } transition-colors duration-300`}
          >
            {message}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Ime"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 mb-4 focus:outline-none focus:ring-4 focus:ring-[#dd2129] transition"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 mb-4 focus:outline-none focus:ring-4 focus:ring-[#dd2129] transition"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 mb-4 focus:outline-none focus:ring-4 focus:ring-[#dd2129] transition"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 mb-6 focus:outline-none focus:ring-4 focus:ring-[#dd2129] transition"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#dd2129] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-xl shadow-lg transition-colors duration-300"
        >
          Registruj se
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Već imate nalog?{" "}
          <Link
            to="/login"
            className="text-[#dd2129] hover:text-[#b91c1c] font-semibold transition-colors duration-300"
          >
            Prijavite se
          </Link>
        </p>
      </form>
    </div>
  );
}
