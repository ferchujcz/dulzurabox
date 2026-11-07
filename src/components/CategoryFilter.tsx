import React from "react";
import { Category } from "@/types/database";
import { Sparkles, Package, Flame, Heart, Camera, Frame } from "lucide-react";

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
  const getCategoryIcon = (slug: string, isSelected: boolean) => {
    const baseClass = `w-4 h-4 shrink-0 ${isSelected ? "text-pink-200" : "text-[#e01e5a]"}`;
    if (slug.includes("hot-wheels")) return <Flame className={baseClass} />;
    if (slug.includes("cajas")) return <Package className={baseClass} />;
    if (slug.includes("ramos")) return <Heart className={baseClass} />;
    if (slug.includes("polaroid")) return <Camera className={baseClass} />;
    if (slug.includes("cuadros")) return <Frame className={baseClass} />;
    return <Sparkles className={baseClass} />;
  };

  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-2 px-1 gap-2 sm:gap-2.5">
      {/* Botón 'Todos' */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`whitespace-nowrap flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-sm cursor-pointer active:scale-95 ${
          selectedCategoryId === null
            ? "bg-[#900020] text-white shadow-[#900020]/25 shadow-md scale-[1.03] ring-2 ring-white"
            : "bg-white/90 hover:bg-white text-[#900020] border border-white"
        }`}
      >
        <Sparkles className={`w-4 h-4 ${selectedCategoryId === null ? "text-pink-200" : "text-[#e01e5a]"}`} />
        <span>Todo el Catálogo</span>
      </button>

      {/* Botones por Categoría */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-sm cursor-pointer active:scale-95 ${
              isSelected
                ? "bg-[#900020] text-white shadow-[#900020]/25 shadow-md scale-[1.03] ring-2 ring-white"
                : "bg-white/90 hover:bg-white text-[#900020] border border-white"
            }`}
          >
            {getCategoryIcon(cat.slug, isSelected)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
