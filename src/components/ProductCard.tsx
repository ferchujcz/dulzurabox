import React from "react";
import Image from "next/image";
import { Product } from "@/types/database";
import { MessageCircle, Gift, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Quiero encargar el producto: ${product.title} de ${formattedPrice}. ¿Tienen disponibilidad?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="card-cute group flex flex-col justify-between overflow-hidden border border-[#900020]/10 bg-white hover:border-[#900020]/30 transition-all duration-300">
      {/* Contenedor de la Imagen */}
      <div 
        className="relative w-full h-56 sm:h-64 bg-pink-50 overflow-hidden cursor-pointer"
        onClick={() => onSelect && onSelect(product)}
      >
        <Image
          src={product.image_url || "/img/caja.jpg"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge de Categoría */}
        {product.category?.name && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#900020] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.category.name}
          </span>
        )}

        {/* Pill de Precio destacado flotante sobre la imagen */}
        <div className="absolute bottom-3 right-3 bg-white text-[#900020] font-black text-base sm:text-lg px-3.5 py-1 rounded-full shadow-lg border border-[#900020]/15 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#900020]" />
          <span>{formattedPrice}</span>
        </div>
      </div>

      {/* Contenido / Textos */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 
            className="text-lg sm:text-xl font-extrabold text-[#900020] leading-snug line-clamp-1 cursor-pointer hover:underline"
            onClick={() => onSelect && onSelect(product)}
          >
            {product.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3 min-h-[3rem]">
            {product.description || "Detalle especial artesanal preparado con amor y dedicación."}
          </p>
        </div>

        {/* Llamado a la Acción (Botón de WhatsApp) */}
        <div className="mt-4 pt-3 border-t border-pink-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            title={`Pedir ${product.title} por WhatsApp`}
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            <span className="text-sm tracking-wide">Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
