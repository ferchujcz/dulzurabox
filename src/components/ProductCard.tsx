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
    <article className="card-cute group flex flex-col justify-between overflow-hidden border-2 border-white bg-white hover:border-pink-200 transition-all duration-300">
      {/* Contenedor de la Imagen */}
      <div
        className="relative w-full h-56 sm:h-64 bg-pink-50 overflow-hidden cursor-pointer"
        onClick={() => onSelect && onSelect(product)}
      >
        <Image
          src={product.image_url || "/img/caja.jpg"}
          alt={`${product.title} - Regalos Personalizados en Oberá - DulzuraBox`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#900020]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges Superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.category?.name ? (
            <span className="bg-white/95 backdrop-blur-md text-[#900020] text-[11px] font-black px-3 py-1 rounded-full shadow-sm border border-pink-100">
              {product.category.name}
            </span>
          ) : (
            <span />
          )}

          {product.badge && (
            <span className="bg-gradient-to-r from-[#e01e5a] to-[#900020] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-200" />
              <span>{product.badge}</span>
            </span>
          )}
        </div>

        {/* Botón rápido de Ver Detalle sobre imagen */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(product);
          }}
          className="absolute bottom-3 left-3 bg-white/90 hover:bg-white text-[#900020] p-2 rounded-full shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all"
          title="Ver detalles y personalizar"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Pill de Precio destacado estilo catálogo DulzuraBox */}
        <div className="absolute bottom-3 right-3 bg-[#fff0f3] text-[#900020] font-black text-base sm:text-lg px-3.5 py-1 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1">
          <span>{formattedPrice}</span>
        </div>
      </div>

      {/* Contenido / Textos */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3
            className="font-sans text-base sm:text-lg font-black text-[#900020] leading-snug line-clamp-1 cursor-pointer hover:text-[#e01e5a] transition-colors"
            onClick={() => onSelect && onSelect(product)}
          >
            {product.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-[#900020]/80 font-medium leading-relaxed line-clamp-3 min-h-[3.25rem]">
            {product.description || "Detalle especial artesanal preparado con amor y dedicación en Oberá."}
          </p>
        </div>

        {/* Acciones: Agregar al Pedido o Pedir Directo por WhatsApp */}
        <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-2">
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-1.5 bg-pink-100 hover:bg-[#900020] text-[#900020] hover:text-white font-extrabold py-2.5 px-3 rounded-xl transition-all duration-200 active:scale-95 shrink-0 text-xs shadow-xs"
              title="Sumar a mi pedido para combinar varios regalos"
            >
              <Plus className="w-4 h-4" />
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1fb855] text-white font-black py-2.5 px-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
            title={`Pedir ${product.title} por WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none shrink-0" />
            <span className="text-xs sm:text-sm tracking-wide">Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
}
