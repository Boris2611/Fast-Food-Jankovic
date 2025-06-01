import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import LogoJankovic from "../assets/LogoJankovic.png";
import testImg from "../assets/products/test.png";

import SearchAndFilter from "../components/SearchAndFilter";
import ProductList from "../components/ProductList";
import AddProductForm from "../components/AddProductForm";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.4 }
  },
};

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const userRole = user?.role || "kupac";

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("Sve");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  function deduceCategory(name) {
    const n = name.toLowerCase();
    if (n.includes("burger")) return "Burgeri";
    if (n.includes("pomfrit") || n.includes("dodatak")) return "Dodaci";
    if (n.includes("cola") || n.includes("piće") || n.includes("voda")) return "Piće";
    return "Burgeri";
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/menu-items", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Nema pristupa meniju");
        return res.json();
      })
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id,
          name: item.naziv,
          description: item.opis,
          price: item.cena,
          category: deduceCategory(item.naziv),
          image: item.slikaPath ? item.slikaPath : testImg,
        }));
        setItems(mapped);
        setFiltered(mapped);
      })
      .catch(err => {
        setError(err.message);
        setItems([]);
        setFiltered([]);
      });
  }, []);

  useEffect(() => {
    let temp = [...items];
    if (category !== "Sve") temp = temp.filter(i => i.category === category);
    if (search.trim())
      temp = temp.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(temp);
  }, [category, search, items]);

  const handleAddProduct = ({ naziv, opis, kategorija, cena, dostupno, imageFile }) => {
    if (!naziv || !opis || !cena) {
      alert("Popunite sva polja!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("naziv", naziv);
    formData.append("opis", opis);
    formData.append("kategorija", kategorija);
    formData.append("cena", cena);
    formData.append("dostupno", dostupno);
    if (imageFile) formData.append("slika", imageFile);

    fetch("/api/menu-items", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, // Content-Type NE stavljaj, browser sam dodaje multipart
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri dodavanju proizvoda");
        return res.json();
      })
      .then(noviItem => {
        const noviMapped = {
          id: noviItem.id,
          name: noviItem.naziv,
          description: noviItem.opis,
          price: noviItem.cena,
          category: noviItem.kategorija,
          image: noviItem.slikaPath ? noviItem.slikaPath : testImg,
        };
        setItems(prev => [...prev, noviMapped]);
        setFiltered(prev => [...prev, noviMapped]);
      })
      .catch(e => alert(e.message));
  };

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <motion.div
        className="min-h-screen bg-white dark:bg-gray-900 px-6 pt-8 pb-24 transition-colors duration-500"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-center mb-8">
          <img
            src={LogoJankovic}
            alt="Fast Food Janković"
            className="h-44 transition-filter duration-500"
            style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
          />
        </div>

        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        {userRole.toLowerCase() === "admin" && (
          <AddProductForm onAdd={handleAddProduct} />
        )}

        <ProductList items={filtered} error={error} />
      </motion.div>
    </div>
  );
}
