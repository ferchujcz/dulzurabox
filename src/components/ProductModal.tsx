import React from "react";
import Image from "next/image";
import { Product } from "@/types/database";
import { X, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.price);

  const whatsappMessage = encodeURIComponent(
    `¡Hola DulzuraBox! Quiero encargar el producto: ${product.title} de ${formattedPrice}. ¿Cómo coordinamos el envío/entrega?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md backdrop-blur transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen del Producto */}
        <div className="relative w-full h-72 sm:h-80 bg-pink-100 flex-shrink-0">
          <Image
            src={product.image_url || "/img/caja.jpg"}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.category?.name && (
            <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-[#900020] text-xs font-black px-3 py-1 rounded-full shadow-md">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Detalle y Descripción */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-[#900020] leading-tight">
                {product.title}
              </h2>
              <div className="bg-pink-100 text-[#900020] font-black text-xl px-3.5 py-1 rounded-2xl whitespace-nowrap shadow-sm border border-pink-200">
                {formattedPrice}
              </div>
            </div>

            <div className="mt-4 bg-pink-50/70 p-4 rounded-2xl border border-pink-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#900020] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#900020]" />
                Detalles del Contenido
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <p className="mt-3 text-xs text-gray-700 italic text-center">
              * Los pedidos se reservan con anticipación. Personalizamos tu tarjeta con el mensaje que desees.
            </p>
          </div>

          {/* Botón WhatsApp */}
          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-6 h-6 fill-white stroke-none" />
              <span className="text-base">Encargar por WhatsApp ahora</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
