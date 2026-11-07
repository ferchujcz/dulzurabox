"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CATALOG_SHEETS } from "@/lib/seed-data";
import { X, ChevronLeft, ChevronRight, Images, MessageCircle } from "lucide-react";

interface CatalogSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogSheetsModal({ isOpen, onClose }: CatalogSheetsModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isOpen) return null;

  const currentSheet = CATALOG_SHEETS[activeIndex];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? CATALOG_SHEETS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CATALOG_SHEETS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#ffb6c1] rounded-3xl overflow-hidden shadow-2xl border-2 border-white flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="bg-[#900020] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Images className="w-4 h-4 text-pink-200" />
            <span className="text-xs sm:text-sm font-black">
              Lámina {activeIndex + 1} de {CATALOG_SHEETS.length}: {currentSheet.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all"
            aria-label="Cerrar láminas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visor de Lámina */}
        <div className="relative w-full h-[65vh] sm:h-[72vh] bg-[#ffb6c1] flex items-center justify-center">
          <Image
            src={currentSheet.image}
            alt={`${currentSheet.title} - Catálogo DulzuraBox Oberá`}
            fill
            className="object-contain"
          />

          {/* Flechas laterales */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#900020] shadow-lg transition-all active:scale-90"
            aria-label="Lámina anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#900020] shadow-lg transition-all active:scale-90"
            aria-label="Siguiente lámina"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Miniaturas / Selector y Botón de WhatsApp */}
        <div className="p-3.5 bg-white border-t border-pink-200 flex flex-col gap-2.5">
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATALOG_SHEETS.map((sheet, idx) => (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all ${
                  idx === activeIndex
                    ? "bg-[#900020] text-white shadow-xs"
                    : "bg-pink-50 text-[#900020] hover:bg-pink-100"
                }`}
              >
                {sheet.title.replace("Edición ", "")}
              </button>
            ))}
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `¡Hola DulzuraBox! ✨ Estaba viendo la lámina "${currentSheet.title}" del catálogo y quiero hacer un pedido.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-black py-2.5 px-4 rounded-xl shadow-md text-xs sm:text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>Consultar por {currentSheet.title} en WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
