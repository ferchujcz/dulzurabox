import React from "react";
import { Category } from "@/types/database";
import { Sparkles, Package, Flame, Heart, Image as ImageIcon } from "lucide-react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  // Helper para asignar icono amigable según el slug o nombre
  const getCategoryIcon = (slug: string) => {
    if (slug.includes("hot-wheels")) return <Flame className="w-4 h-4 text-orange-500" />;
    if (slug.includes("cajas")) return <Package className="w-4 h-4 text-pink-600" />;
    if (slug.includes("ramos")) return <Heart className="w-4 h-4 text-red-500" />;
    if (slug.includes("polaroid") || slug.includes("cuadros")) return <ImageIcon className="w-4 h-4 text-purple-500" />;
    return <Sparkles className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-3 px-2 gap-2 sm:gap-3">
      {/* Botón 'Todos' */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-200 shadow-sm ${
          selectedCategoryId === null
            ? "bg-[#900020] text-white shadow-[#900020]/30 shadow-md scale-105"
            : "bg-white/80 hover:bg-white text-[#900020] hover:scale-102"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Todos</span>
      </button>

      {/* Botones por Categoría */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-200 shadow-sm ${
              isSelected
                ? "bg-[#900020] text-white shadow-[#900020]/30 shadow-md scale-105"
                : "bg-white/80 hover:bg-white text-[#900020] hover:scale-102"
            }`}
          >
            {getCategoryIcon(cat.slug)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
