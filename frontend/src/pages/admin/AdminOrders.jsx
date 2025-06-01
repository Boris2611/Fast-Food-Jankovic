import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../../config"; // import backend URL

const STATUS_LABELS = {
  POSLATA: "Novo",
  U_PRIPREMI: "U pripremi",
  GOTOVA: "Gotova",
  ISPORUCENA: "Isporučena",
};

const presetTimes = [10, 15, 20, 25, 30];

function ClockIcon() {
  return (
    <svg
      className="w-5 h-5 inline-block mr-1 text-gray-600 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minutesMap, setMinutesMap] = useState({});
  const [activeStatus, setActiveStatus] = useState("POSLATA");

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role?.toLowerCase() !== "admin") {
      setError("Nemate pristup ovoj stranici.");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Niste ulogovani");
      const res = await axios.get(`${BACKEND_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Greška pri učitavanju porudžbina.");
    } finally {
      setLoading(false);
    }
  };

  function getTimeLeft(estimatedReady) {
    if (!estimatedReady) return null;
    const diffMs = new Date(estimatedReady).getTime() - now;
    if (diffMs <= 0) return null;
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return { minutes, seconds };
  }

  function getProgressPercent(createdAt, estimatedReady) {
    if (!estimatedReady || !createdAt) return 0;
    const start = new Date(createdAt).getTime();
    const end = new Date(estimatedReady).getTime();
    const total = end - start;
    const elapsed = now - start;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  const updateOrderStatus = async (id, status, minutes = null) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_URL}/api/orders/${id}/status`,
        {
          status,
          minutes: minutes !== null ? minutes.toString() : "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      alert(
        `Greška pri ažuriranju statusa: ${
          err.response?.data || err.message || "Neuspešno"
        }`
      );
    }
  };

  const filteredOrders = orders.filter((order) => order.status === activeStatus);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-gray-100">
        Administracija porudžbina
      </h1>

      {/* Tabovi */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {Object.entries(STATUS_LABELS).map(([key, label]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveStatus(key)}
              className={`relative px-6 py-2 rounded-full font-semibold shadow-md transition-colors
              ${
                activeStatus === key
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-red-500 hover:text-white"
              }`}
            >
              {label}
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg select-none">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">Učitavanje...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          Nema porudžbina sa statusom "{STATUS_LABELS[activeStatus]}".
        </p>
      ) : (
        <ul className="space-y-10">
          {filteredOrders.map((order) => {
            const timeLeft = getTimeLeft(order.estimatedReady);
            const progressPercent = getProgressPercent(order.createdAt, order.estimatedReady);
            const totalPrice = order.orderItems.reduce((sum, item) => {
              const price = item.menuItem?.cena || 0;
              return sum + price * item.quantity;
            }, 0);

            return (
              <li
                key={order.id}
                className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8 border border-gray-300 dark:border-gray-700 max-w-5xl mx-auto flex flex-col md:flex-row gap-8"
              >
                <div className="flex-1 flex flex-col gap-2 z-10 relative">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {order.user?.ime || order.user?.name || "Nepoznato ime"}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {order.user?.telefon || order.user?.phone || "Nepoznat broj"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-sm mb-4">
                    <strong>Email:</strong> {order.user?.email || "Nepoznato"}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 shadow-inner max-h-56 overflow-y-auto">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100 text-lg">
                      Stavke porudžbine:
                    </p>
                    <ul className="space-y-3">
                      {order.orderItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-5"
                        >
                          <img
                            src={item.menuItem?.slikaPath || "/default-product.png"}
                            alt={item.menuItem?.naziv || "Proizvod"}
                            className="w-20 h-20 rounded-md object-cover border border-gray-300 dark:border-gray-600"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                              {item.menuItem?.naziv || "Nepoznat proizvod"}
                            </span>
                            <span className="text-lg text-gray-700 dark:text-gray-300 font-semibold mt-1">
                              Količina: {item.quantity}
                            </span>
                            <span className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                              Cena: {item.menuItem?.cena?.toLocaleString("sr-RS")} RSD
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opcije po statusu */}
                  {activeStatus === "POSLATA" && (
                    <>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-6 font-semibold">
                        Odaberite vreme spremnosti:
                      </p>
                      <div className="flex justify-between mt-2 gap-4 flex-wrap">
                        <div className="flex gap-3 flex-wrap">
                          {presetTimes.map((min) => (
                            <button
                              key={min}
                              onClick={() => updateOrderStatus(order.id, "U_PRIPREMI", min)}
                              className="bg-red-600 text-white rounded-full px-6 py-2 font-semibold hover:bg-red-700 transition"
                            >
                              {min} min
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            min={1}
                            placeholder="Min"
                            value={minutesMap[order.id] || ""}
                            onChange={(e) =>
                              setMinutesMap({ ...minutesMap, [order.id]: Number(e.target.value) })
                            }
                            className="w-20 text-center border rounded-full px-4 py-2 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                          />
                          <button
                            onClick={() => {
                              const mins = minutesMap[order.id];
                              if (!mins || mins < 1) {
                                alert("Unesite validan broj minuta");
                                return;
                              }
                              updateOrderStatus(order.id, "U_PRIPREMI", mins);
                            }}
                            className="bg-red-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-red-700 transition"
                          >
                            Potvrdi
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {activeStatus === "U_PRIPREMI" && (
                    <>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-6 font-semibold flex items-center gap-2">
                        <ClockIcon />
                        Vreme preostalo:{" "}
                        {timeLeft
                          ? `${timeLeft.minutes}m ${timeLeft.seconds}s`
                          : "Spremno za preuzimanje"}
                      </p>

                      <div className="w-full h-4 rounded-full bg-gray-300 dark:bg-gray-700 mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="h-full bg-red-600 dark:bg-red-500"
                        />
                      </div>

                      <div className="flex justify-between mt-4 items-center flex-wrap gap-3">
                        {[1, 3, 10, 15].map((min) => (
                          <button
                            key={min}
                            onClick={() => {
                              const oldMinutes = minutesMap[order.id] || 0;
                              updateOrderStatus(order.id, "U_PRIPREMI", oldMinutes + min);
                              setMinutesMap({ ...minutesMap, [order.id]: oldMinutes + min });
                            }}
                            className="bg-red-600 text-white rounded-full px-5 py-2 font-semibold hover:bg-red-700 transition"
                          >
                            +{min} min
                          </button>
                        ))}
                        <button
                          onClick={() => updateOrderStatus(order.id, "GOTOVA", 0)}
                          className="bg-green-600 text-white rounded-full px-7 py-2 font-semibold hover:bg-green-700 transition"
                        >
                          Označi kao gotovo
                        </button>
                      </div>
                    </>
                  )}

                  {activeStatus === "GOTOVA" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "ISPORUCENA", 0)}
                      className="bg-blue-600 text-white rounded-full px-7 py-2 hover:bg-blue-700 transition font-semibold mt-6"
                    >
                      Označi kao isporučeno
                    </button>
                  )}

                  {activeStatus === "ISPORUCENA" && (
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Da li ste sigurni da želite da obrišete ovu isporučenu porudžbinu?"
                          )
                        ) {
                          try {
                            const token = localStorage.getItem("token");
                            await axios.delete(`${BACKEND_URL}/api/orders/${order.id}`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            fetchOrders();
                          } catch {
                            alert("Greška pri brisanju porudžbine.");
                          }
                        }
                      }}
                      className="bg-gray-600 text-white rounded-full px-7 py-2 hover:bg-gray-700 transition font-semibold mt-6"
                    >
                      Obriši porudžbinu
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
