import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import { BACKEND_URL } from "../config";

const containerVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.97, transition: { duration: 0.3 } },
};

function formatTimeLeft(ms) {
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return { minutes, seconds };
}

function progressColors(percent) {
  if (percent > 75) return "bg-red-600";
  if (percent > 50) return "bg-red-500";
  if (percent > 25) return "bg-red-400";
  return "bg-red-300";
}

function AnimatedCircle() {
  return (
    <motion.svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="#dc2626" opacity={0.3} />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="#dc2626"
        strokeDasharray="60"
        strokeDashoffset="60"
        animate={{ strokeDashoffset: [60, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function ReadyIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-green-500 drop-shadow-lg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 1, filter: "drop-shadow(0 0 0 rgba(72,187,120,0))" }}
      animate={{
        scale: [1, 1.15, 1],
        filter: [
          "drop-shadow(0 0 0 rgba(72,187,120,0))",
          "drop-shadow(0 0 10px rgba(72,187,120,0.7))",
          "drop-shadow(0 0 0 rgba(72,187,120,0))",
        ],
      }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      role="img"
      aria-label="Porudžbina spremna"
    >
      <polyline points="20 6 9 17 4 12" />
    </motion.svg>
  );
}

function ReviewModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const stars = [1, 2, 3, 4, 5];

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError("Ocena mora biti između 1 i 5.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const menuItemId = order.orderItems[0]?.menuItem?.id ?? null;

    if (!menuItemId) {
      setError("Nevalidni podaci za recenziju (nedostaje proizvod).");
      setSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        menuItemId,
        rating,
        comment,
      });
      setSubmitting(false);
      onClose();
    } catch (err) {
      if (err.response) {
        setError(`Greška: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        setError("Nema odgovora sa servera.");
      } else {
        setError("Greška prilikom slanja recenzije.");
      }
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="review-modal-title"
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2
          id="review-modal-title"
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center"
        >
          Oceni porudžbinu
        </h2>

        <div className="flex justify-center mb-4 space-x-2">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Oceni sa ${star} zvezdica`}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
              } focus:outline-none`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 mb-4 text-gray-900 dark:text-gray-100 resize-none"
          placeholder="Napiši komentar (opciono)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          aria-label="Komentar za recenziju"
        />

        {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {submitting ? "Šaljem..." : "Pošalji"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrderCard({ order, now, onReviewClick, dimmed }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0.85, 1, 0.85],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
    });
  }, [controls]);

  const estimatedMs = order.estimatedReady ? new Date(order.estimatedReady).getTime() : 0;
  const createdMs = new Date(order.createdAt).getTime();
  const diffMs = estimatedMs - now;
  const totalDurationMs = estimatedMs - createdMs;
  const timeLeft = formatTimeLeft(diffMs);

  const isReady = order.status === "GOTOVA" || order.status === "SPREMNA";
  const isDelivered = order.status === "ISPORUCENA";

  const elapsedPercent =
    totalDurationMs > 0
      ? Math.min(100, Math.max(0, ((now - createdMs) / totalDurationMs) * 100))
      : isReady
      ? 100
      : 0;

  const statusColors = {
    POSLATA: "bg-yellow-100 text-yellow-800",
    U_PRIPREMI: "bg-red-500 text-white",
    GOTOVA: "bg-green-600 text-white",
    ISPORUCENA: "bg-gray-400 text-gray-600", // posiveno za isporucene
  };

  const statusText = {
    POSLATA: "POSLATA",
    U_PRIPREMI: "U PRIPREMI",
    GOTOVA: "GOTOVA",
    ISPORUCENA: "ISPORUČENA",
  };

  const statusStyle = statusColors[order.status] || "bg-gray-300 text-gray-700";

  const totalPrice = order.orderItems.reduce((sum, item) => {
    const cena = item.menuItem?.cena ?? item.cena ?? 0;
    return sum + cena * item.quantity;
  }, 0);

  // Za isporucene prikazi samo spisak, bez animacija/progres bara
  if (isDelivered) {
    return (
      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 p-6 max-w-[500px] mx-auto w-full font-sans select-none opacity-50"
        aria-live="polite"
      >
        <header className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 truncate">
            Vaša porudžbina
          </h2>
          <span
            className={`inline-block px-6 py-2 rounded-full font-semibold text-sm sm:text-base tracking-wide ${statusStyle} shadow-lg select-none`}
            aria-label={`Status porudžbine: ${order.status}`}
          >
            {statusText[order.status] || order.status.toUpperCase()}
          </span>
        </header>

        <section>
          <p className="font-semibold mb-5 border-b border-gray-400 dark:border-gray-600 pb-3 text-lg text-gray-700 dark:text-gray-300 select-none">
            Stavke porudžbine
          </p>
          <ul className="max-h-52 overflow-y-auto space-y-3 text-sm text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800">
            {order.orderItems.map((item, idx) => {
              const name = item.menuItem?.naziv || item.menuItem?.name || "Nepoznat proizvod";
              const imgSrc =
                item.menuItem?.slikaPath ||
                item.menuItem?.slika_path ||
                item.menuItem?.image ||
                "/default-product.png";
              const price = item.menuItem?.cena ?? item.cena ?? 0;

              return (
                <li
                  key={item.id || idx}
                  className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-3 shadow-sm gap-4"
                >
                  <img
                    src={imgSrc}
                    alt={name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <span className="flex-1 truncate font-medium text-base">{name}</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-400 select-none text-lg">
                    × {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-600 dark:text-gray-400 select-none text-lg ml-4">
                    {Number(price).toLocaleString("sr-RS")} RSD
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-7 border-t border-gray-300 dark:border-gray-600 pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 select-none">
            Ukupna cena:
          </span>
          <span
            className="font-extrabold text-xl text-gray-600 dark:text-gray-400 select-none"
            aria-label={`Ukupna cena porudžbine ${totalPrice} dinara`}
          >
            {totalPrice.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}
          </span>
        </section>

        <div className="mt-6 text-center">
          <button
            onClick={() => onReviewClick(order)}
            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            aria-label="Ocenite ovu porudžbinu"
          >
            Ocenite ovu porudžbinu
          </button>
        </div>
      </motion.article>
    );
  }

  // Inače normalan prikaz za ostale statuse

  return (
    <motion.article
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 p-8 max-w-[500px] mx-auto w-full font-sans select-none ${
        dimmed ? "opacity-50" : "opacity-100"
      }`}
      style={{ fontFeatureSettings: "'tnum'" }}
      aria-live="polite"
    >
      <div className={dimmed ? "pointer-events-none" : ""}>
        <header className="flex justify-between items-center mb-7">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate">
            Vaša porudžbina
          </h2>
          <span
            className={`inline-block px-6 py-2 rounded-full font-semibold text-sm sm:text-base tracking-wide ${statusStyle} shadow-lg select-none`}
            aria-label={`Status porudžbine: ${order.status}`}
          >
            {statusText[order.status] || order.status.toUpperCase()}
          </span>
        </header>

        <section className="flex flex-col items-center mb-10 min-h-[120px]">
          {order.status === "POSLATA" ? (
            <>
              <AnimatedCircle />
              <p className="font-semibold text-yellow-700 dark:text-yellow-400 text-lg select-none mt-4">
                Čeka se procenjeno vreme
              </p>
            </>
          ) : isReady ? (
            <>
              <ReadyIcon />
              <motion.p
                className="text-green-600 dark:text-green-400 font-extrabold text-3xl sm:text-4xl select-none mt-4"
                aria-live="assertive"
              >
                Spremna za preuzimanje
              </motion.p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-5">
                <AnimatedCircle />
                <motion.p
                  className="font-mono text-4xl sm:text-5xl font-extrabold text-red-600 dark:text-red-400 tracking-widest tabular-nums select-none"
                  aria-live="polite"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  {timeLeft ? `${timeLeft.minutes}m ${timeLeft.seconds}s` : "Uskoro gotova"}
                </motion.p>
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300 font-medium text-base sm:text-lg max-w-sm leading-relaxed">
                Vaša porudžbina se priprema i uskoro će biti spremna. Hvala na strpljenju!
              </p>
              <motion.div
                animate={controls}
                className="relative w-full h-4 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden shadow-inner mt-6"
                aria-label="Progress bar spremnosti porudžbine"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(elapsedPercent)}
              >
                <motion.div
                  style={{ width: `${elapsedPercent}%` }}
                  className={`h-full rounded-full shadow-md ${progressColors(elapsedPercent)}`}
                  transition={{ type: "spring", stiffness: 70, damping: 18 }}
                />
              </motion.div>
            </>
          )}
        </section>

        <section>
          <p className="font-semibold mb-5 border-b border-gray-400 dark:border-gray-600 pb-3 text-lg text-gray-900 dark:text-gray-100 select-none">
            Stavke porudžbine
          </p>
          <ul className="max-h-52 overflow-y-auto space-y-3 text-sm text-gray-900 dark:text-gray-300 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-200 dark:scrollbar-thumb-red-700 dark:scrollbar-track-gray-800">
            {order.orderItems.map((item, idx) => {
              const name = item.menuItem?.naziv || item.menuItem?.name || "Nepoznat proizvod";
              const imgSrc =
                item.menuItem?.slikaPath ||
                item.menuItem?.slika_path ||
                item.menuItem?.image ||
                "/default-product.png";
              const price = item.menuItem?.cena ?? item.cena ?? 0;

              return (
                <li
                  key={item.id || idx}
                  className="flex items-center bg-red-50 dark:bg-red-900 rounded-lg p-3 shadow-md gap-4 hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-250"
                >
                  <img
                    src={imgSrc}
                    alt={name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-sm"
                    loading="lazy"
                  />
                  <span className="flex-1 truncate font-medium text-base">{name}</span>
                  <span className="font-semibold text-red-700 dark:text-red-400 select-none text-lg">
                    × {item.quantity}
                  </span>
                  <span className="font-semibold text-red-700 dark:text-red-400 select-none text-lg ml-4">
                    {Number(price).toLocaleString("sr-RS")} RSD
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-7 border-t border-gray-300 dark:border-gray-600 pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 select-none">
            Ukupna cena:
          </span>
          <span
            className="font-extrabold text-xl text-red-700 dark:text-red-400 select-none"
            aria-label={`Ukupna cena porudžbine ${totalPrice} dinara`}
          >
            {totalPrice.toLocaleString("sr-RS", { style: "currency", currency: "RSD" })}
          </span>
        </section>
      </div>

      {order.status === "ISPORUCENA" && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onReviewClick(order)}
            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            aria-label="Ocenite ovu porudžbinu"
          >
            Ocenite ovu porudžbinu
          </button>
        </div>
      )}
    </motion.article>
  );
}

export default function OrderStatus() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [reviewOrder, setReviewOrder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role?.toLowerCase() === "admin") {
      navigate("/admin/AdminOrders", { replace: true });
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Niste prijavljeni.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${BACKEND_URL}/api/orders/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = res.data
          .filter((o) => o.status !== "OTKAZANA")
          .sort((a, b) => {
            if (a.status === "ISPORUCENA" && b.status !== "ISPORUCENA") return 1;
            if (a.status !== "ISPORUCENA" && b.status === "ISPORUCENA") return -1;
            return 0;
          });

        setOrders(sortedOrders);
        setLoading(false);
      } catch (e) {
        setError("Ne mogu da preuzmem status porudžbine.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const submitReview = async ({ menuItemId, rating, comment }) => {
    if (!menuItemId) throw new Error("Nevalidni podaci za recenziju");

    const token = localStorage.getItem("token");
    await axios.post(
      `${BACKEND_URL}/api/reviews`,
      {
        menuItem: { id: menuItemId },
        user: { id: user.id },
        rating,
        comment,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setOrders((prev) => prev.filter((o) => o.id !== reviewOrder.id));
  };

  const handleReviewClose = () => {
    setReviewOrder(null);
  };

  const handleReviewClick = (order) => {
    setReviewOrder(order);
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-lg font-medium animate-pulse text-gray-900 dark:text-white">
          Provera korisnika...
        </p>
      </div>
    );

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <p className="text-lg font-medium animate-pulse">Učitavanje statusa porudžbina...</p>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900 text-red-400" : "bg-white text-red-600"
        }`}
      >
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div
        className={`${
          theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
        } min-h-screen flex flex-col items-center justify-center px-6`}
      >
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-center select-none">
          Status porudžbine
        </h1>
        <p className="text-lg font-normal">Nema aktivnih porudžbina.</p>
      </div>
    );

  return (
    <>
      <main
        className={`${
          theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
        } min-h-screen px-6 py-8 max-w-lg mx-auto flex flex-col gap-10`}
        role="main"
        aria-label="Status porudžbina"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-center select-none mb-8">
          Status porudžbina
        </h1>

        <AnimatePresence initial={false}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              now={now}
              onReviewClick={handleReviewClick}
              dimmed={order.status === "ISPORUCENA"}
            />
          ))}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {reviewOrder && (
          <ReviewModal order={reviewOrder} onClose={handleReviewClose} onSubmit={submitReview} />
        )}
      </AnimatePresence>
    </>
  );
}
