import React from "react";
import Image from "next/image";
import { Product } from "@/types/database";
import { MessageCircle, Sparkles, ShoppingBag, Plus, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const formattedPrice = product.price_label
    ? product.price_label
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(product.price);

  const whatsappMessage = encodeURIComponent(
    `¡Hola DulzuraBox! ✨ Quiero encargar el producto:\n*${product.title}* (${formattedPrice}).\n¿Tienen disponibilidad para coordinar mi pedido en Oberá?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <article className="card-boutique group flex flex-col justify-between overflow-hidden">
      {/* Contenedor de Imagen con Aspect Ratio Uniforme */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[1/1] bg-[#fff0f4] overflow-hidden cursor-pointer"
        onClick={() => onSelect && onSelect(product)}
      >
        <Image
          src={product.image_url || "/img/caja.jpg"}
          alt={`${product.title} - Regalos Personalizados en Oberá - DulzuraBox`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3d0c1a]/45 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Etiquetas Superiores */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          {product.category?.name ? (
            <span className="bg-white/95 backdrop-blur-md text-[#7A0022] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
              {product.category.name}
            </span>
          ) : (
            <span />
          )}

          {product.badge && (
            <span className="bg-[#7A0022] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ff85a2]" />
              <span>{product.badge}</span>
            </span>
          )}
        </div>

        {/* Botón rápido de vista previa */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(product);
          }}
          className="absolute bottom-3.5 left-3.5 bg-white/95 hover:bg-white text-[#7A0022] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 opacity-95 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          title="Ver detalles y personalizar tarjeta"
        >
          <Eye className="w-3.5 h-3.5 text-[#D91B5C]" />
          <span>Personalizar</span>
        </button>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-[#7A0022] tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-[11px] font-semibold text-[#9e586d]">
              Tarjeta incluida
            </span>
          </div>

          <h3
            className="font-display text-base sm:text-lg font-bold text-[#2b0711] leading-snug line-clamp-1 cursor-pointer group-hover:text-[#D91B5C] transition-colors"
            onClick={() => onSelect && onSelect(product)}
          >
            {product.title}
          </h3>

          <p className="mt-2 text-xs sm:text-[13px] text-[#6e3043] leading-relaxed line-clamp-3 min-h-[3.25rem]">
            {product.description || "Detalle especial artesanal preparado con amor y dedicación en Oberá."}
          </p>
        </div>

        {/* Botones de Compra: Bolsa + WhatsApp Directo */}
        <div className="mt-5 pt-3.5 border-t border-[#7A0022]/8 flex items-center gap-2">
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-1 bg-[#fff0f4] hover:bg-[#ffe0e9] text-[#7A0022] border border-[#f8c6d4] font-bold py-2.5 px-3.5 rounded-xl transition-all duration-200 active:scale-95 shrink-0 text-xs cursor-pointer"
              title="Sumar a mi bolsa para combinar varios productos"
            >
              <Plus className="w-3.5 h-3.5 text-[#D91B5C]" />
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#7A0022] hover:bg-[#D91B5C] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all duration-200 active:scale-[0.98]"
            title={`Pedir ${product.title} por WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs sm:text-sm">Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
