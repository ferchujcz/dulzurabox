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
    const baseClass = `w-4 h-4 shrink-0 transition-colors ${
      isSelected ? "text-[#ff85a2]" : "text-[#D91B5C]"
    }`;
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
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
          selectedCategoryId === null
            ? "bg-[#7A0022] text-white shadow-md shadow-[#7A0022]/20"
            : "bg-white hover:bg-[#fff0f4] text-[#521525] border border-[#7A0022]/12 shadow-2xs"
        }`}
      >
        <Sparkles
          className={`w-4 h-4 ${
            selectedCategoryId === null ? "text-[#ff85a2]" : "text-[#D91B5C]"
          }`}
        />
        <span>Todo el Catálogo</span>
      </button>

      {/* Botones por Categoría */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
              isSelected
                ? "bg-[#7A0022] text-white shadow-md shadow-[#7A0022]/20"
                : "bg-white hover:bg-[#fff0f4] text-[#521525] border border-[#7A0022]/12 shadow-2xs"
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
