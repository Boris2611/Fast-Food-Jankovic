import { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddProductForm({ onAdd, editItem = null, clearEdit }) {
  const [naziv, setNaziv] = useState("");
  const [opis, setOpis] = useState("");
  const [kategorija, setKategorija] = useState("Pljeskavice");
  const [cena, setCena] = useState("");
  const [dostupno, setDostupno] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [open, setOpen] = useState(false);
  const modalRef = useRef();

  const kategorije = [
    "Pljeskavice",
    "Pica",
    "Palačinke",
    "Na kilogram",
    "Sendviči",
    "Iz friteze",
  ];

  // Popuni polja ako editujemo
  useEffect(() => {
    if (editItem) {
      setNaziv(editItem.name);
      setOpis(editItem.description);
      setKategorija(editItem.category);
      setCena(editItem.price);
      setDostupno(true); // možete dodati i editItem.dostupno ako imate
      setImagePreview(editItem.image);
      setOpen(true);
    }
  }, [editItem]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = {
      id: editItem?.id,
      naziv,
      opis,
      kategorija,
      cena,
      dostupno,
      imageFile,
    };

    onAdd(data, !!editItem);

    // Reset forme
    setNaziv("");
    setOpis("");
    setKategorija("Pljeskavice");
    setCena("");
    setDostupno(true);
    setImageFile(null);
    setImagePreview(null);
    setOpen(false);
    clearEdit();
  }

  function handleBackdropClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpen(false);
      clearEdit();
    }
  }

  return (
    <>
      {!editItem && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-5 left-5 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#dd2129] text-white shadow-lg hover:bg-[#b91c1c] transition-all"
          aria-label="Dodaj proizvod"
          title="Dodaj proizvod"
        >
          <FaPlus size={20} />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-40"
          onClick={handleBackdropClick}
        >
          <form
            ref={modalRef}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-md relative space-y-5 border border-gray-200 dark:border-gray-700 transition-all"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                clearEdit();
              }}
              className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-red-600 transition"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              {editItem ? "Izmeni proizvod" : "Dodaj proizvod"}
            </h2>

            <input
              type="text"
              placeholder="Naziv proizvoda"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-[#dd2129] outline-none transition"
              required
            />

            <textarea
              placeholder="Kratak opis"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-[#dd2129] outline-none transition"
              rows={3}
              required
            />

            <select
              value={kategorija}
              onChange={(e) => setKategorija(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-[#dd2129] transition"
            >
              {kategorije.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Cena (RSD)"
              value={cena}
              onChange={(e) => setCena(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-[#dd2129] transition"
              min={0}
              required
            />

            <div className="flex items-center">
              <input
                id="dostupno"
                type="checkbox"
                checked={dostupno}
                onChange={(e) => setDostupno(e.target.checked)}
                className="w-5 h-5 text-[#dd2129] focus:ring-[#dd2129] border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
              <label
                htmlFor="dostupno"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Dostupno za naručivanje
              </label>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#dd2129] file:text-white hover:file:bg-[#b91c1c] transition"
              required={!editItem}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Pregled slike"
                className="max-h-40 rounded-xl mx-auto mt-2 border border-gray-300 dark:border-gray-600"
              />
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#dd2129] hover:bg-[#b91c1c] text-white font-semibold rounded-xl shadow-lg transition"
            >
              {editItem ? "Sačuvaj izmene" : "Sačuvaj proizvod"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
