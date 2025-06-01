import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import useProducts from "../hooks/useProducts";
import CartButton from "../components/CartButton";
import LogoHeader from "../components/LogoHeader";
import SearchAndFilter from "../components/SearchAndFilter";
import ProductList from "../components/ProductList";
import AddProductForm from "../components/AddProductForm";
import AddToCartModal from "../components/AddToCartModal";

import { BACKEND_URL } from "../config";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.4 },
  },
};

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = (user?.role || "kupac").toLowerCase();

  const { cartItems, addToCart, incrementQty, decrementQty } = useCart();
  const navigate = useNavigate();

  const {
    filtered,
    category,
    setCategory,
    search,
    setSearch,
    error,
    fetchItems,
    deleteProduct,
  } = useProducts();

  const [editItem, setEditItem] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setModalProduct(product);
    setModalOpen(true);
  };

  const handleQuantityChange = (newQty) => {
    if (!modalProduct) return;
    const currentItem = cartItems.find((i) => i.id === modalProduct.id);
    if (!currentItem) return;

    const diff = newQty - currentItem.quantity;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) incrementQty(modalProduct.id);
    } else if (diff < 0) {
      for (let i = 0; i < -diff; i++) decrementQty(modalProduct.id);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleOrderNow = () => {
    setModalOpen(false);
    navigate("/cart");
  };

  const handleAddProduct = (product, isEdit = false) => {
    const { naziv, opis, kategorija, cena, dostupno, imageFile, id } = product;

    if (!naziv || !opis || !cena) {
      alert("Popunite sva polja!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("naziv", naziv);
    formData.append("opis", opis);
    formData.append("kategorija", kategorija);
    formData.append("cena", parseFloat(cena));
    formData.append("dostupno", dostupno);
    if (imageFile) {
      formData.append("slika", imageFile);
    }

    const url = isEdit
      ? `${BACKEND_URL}/api/menu-items/${id}`
      : `${BACKEND_URL}/api/menu-items`;

    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri čuvanju proizvoda");
        return res.json();
      })
      .then(() => {
        setEditItem(null);
        fetchItems();
      })
      .catch((e) => alert(e.message));
  };

  const handleEditProduct = (item) => setEditItem(item);

  const handleDeleteProduct = (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj proizvod?")) {
      deleteProduct(id).catch(() => alert("Greška pri brisanju proizvoda."));
    }
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <CartButton />

      <motion.div
        className="min-h-screen bg-white dark:bg-gray-900 px-6 pt-8 pb-24 transition-colors duration-500"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <LogoHeader />

        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        {userRole === "admin" && (
          <AddProductForm
            onAdd={handleAddProduct}
            editItem={editItem}
            clearEdit={() => setEditItem(null)}
          />
        )}

        <ProductList
          items={filtered}
          error={error}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAddToCart={handleAddToCart}
        />
      </motion.div>

      <AddToCartModal
        productName={modalProduct?.name || ""}
        productImage={modalProduct?.image || ""}
        productPrice={modalProduct?.price || 0}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onOrderNow={handleOrderNow}
        initialQuantity={cartItems.find((i) => i.id === modalProduct?.id)?.quantity || 1}
        onQuantityChange={handleQuantityChange}
      />
    </div>
  );
}
