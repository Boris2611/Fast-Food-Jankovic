import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import Cart from "./pages/Cart";
import OrderStatus from "./pages/OrderStatus";
import AdminOrders from "./pages/admin/AdminOrders";

import BottomNavbar from "./components/BottomNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function AppWrapper() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const showNavbar = location.pathname !== "/" && !!token;

  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pb-16 transition-colors duration-300">
      {showNavbar && <BottomNavbar />}
      <Routes>
        {/* Landing i pristup bez tokena */}
        <Route path="/" element={!token ? <Landing /> : <Navigate to="/home" replace />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/home" replace />} />

        {/* Zaštićene rute za sve ulogovane */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-status"
          element={
            <ProtectedRoute>
              <OrderStatus />
            </ProtectedRoute>
          }
        />

        {/* Samo za admina */}
        <Route
          path="/admin/AdminOrders"
          element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* Svi ostali slučajevi (nepoznate rute) */}
        <Route path="*" element={<Navigate to={token ? "/home" : "/"} replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppWrapper />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
