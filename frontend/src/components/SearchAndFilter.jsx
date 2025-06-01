import { motion } from "framer-motion";

const kategorije = [
  "Sve",
  "Pljeskavice",
  "Pica",
  "Palačinke",
  "Na kilogram",
  "Sendviči",
  "Iz friteze",
];

export default function SearchAndFilter({ search, setSearch, category, setCategory }) {
  return (
    <div className="max-w-md mx-auto mb-8">
      <input
        type="text"
        placeholder="Pretraži proizvode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white
          shadow-md focus:outline-none focus:ring-4 focus:ring-[#dd2129] placeholder-gray-400 dark:placeholder-gray-500 transition"
      />
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {kategorije.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setCategory(cat)}
            whileTap={{ scale: 0.9 }}
            className={`relative px-6 py-2 rounded-full text-sm font-semibold border transition 
              ${
                category === cat
                  ? "bg-[#dd2129] text-white border-[#dd2129]"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-[#faa91a] hover:border-[#faa91a] hover:text-white"
              } overflow-hidden`}
          >
            {cat}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
