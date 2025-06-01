import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

export default function useProducts() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("Sve");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Fetch proizvoda sa backend-a
  const fetchItems = () => {
    const token = localStorage.getItem("token");
    fetch(`${BACKEND_URL}/api/menu-items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nema pristupa meniju");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((item) => ({
          id: item.id.toString(),
          name: item.naziv,
          description: item.opis,
          price: item.cena,
          category: item.kategorija,
          image: `${BACKEND_URL}${item.slikaPath}`,
        }));
        setItems(mapped);
        setFiltered(mapped);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setItems([]);
        setFiltered([]);
      });
  };

  // Filter i pretraga
  useEffect(() => {
    let temp = [...items];
    if (category !== "Sve") {
      temp = temp.filter((i) => i.category === category);
    }
    if (search.trim()) {
      temp = temp.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(temp);
  }, [category, search, items]);

  useEffect(fetchItems, []);

  // Delete proizvod
  const deleteProduct = (id) => {
    const token = localStorage.getItem("token");
    return fetch(`${BACKEND_URL}/api/menu-items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri brisanju proizvoda");
        setItems((prev) => prev.filter((item) => item.id !== id));
        setFiltered((prev) => prev.filter((item) => item.id !== id));
      });
  };

  return {
    items,
    filtered,
    category,
    setCategory,
    search,
    setSearch,
    error,
    fetchItems,
    deleteProduct,
  };
}
