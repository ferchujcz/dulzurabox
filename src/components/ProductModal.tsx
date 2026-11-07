import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/database";
import { X, MessageCircle, CheckCircle2, Heart, ShoppingBag, Sparkles, Gift } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [dedicationNote, setDedicationNote] = useState("");
  const [extraRequest, setExtraRequest] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<"coordinar" | "envio" | "retiro">("coordinar");

  if (!product) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const formattedPrice = product.price_label
    ? product.price_label
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }).format(product.price);

  const deliveryLabel =
    deliveryOption === "envio"
      ? "Envío a domicilio en Oberá"
      : deliveryOption === "retiro"
      ? "Retiro acordado en Oberá"
      : "A coordinar";

  const lines = [
    `¡Hola DulzuraBox! ✨ Quiero encargar este regalo del catálogo:`,
    ``,
    `🎁 *Producto:* ${product.title}`,
    `💰 *Precio ref:* ${formattedPrice}`,
    `📍 *Entrega:* ${deliveryLabel}`,
  ];

  if (dedicationNote.trim()) {
    lines.push(`💌 *Mensaje para la tarjeta:* "${dedicationNote.trim()}"`);
  }
  if (extraRequest.trim()) {
    lines.push(`✨ *Personalización / Extras:* ${extraRequest.trim()}`);
  }

  lines.push(``, `¿Cómo coordinamos el pago y la fecha de entrega?`);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-2 bg-white/90 hover:bg-white text-[#900020] rounded-full shadow-md backdrop-blur transition-all active:scale-90"
          aria-label="Cerrar detalle"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen del Producto */}
        <div className="relative w-full h-60 sm:h-72 bg-pink-100 flex-shrink-0">
          <Image
            src={product.image_url || "/img/caja.jpg"}
            alt={product.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {product.category?.name && (
            <span className="absolute bottom-3.5 left-4 bg-white/95 backdrop-blur text-[#900020] text-xs font-black px-3 py-1 rounded-full shadow-md">
              {product.category.name}
            </span>
          )}

          <div className="absolute bottom-3.5 right-4 bg-[#fff0f3] text-[#900020] font-black text-lg sm:text-xl px-4 py-1 rounded-2xl shadow-lg border-2 border-white">
            {formattedPrice}
          </div>
        </div>

        {/* Detalle y Personalización rápida */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
          <div>
            <h2 className="font-sans text-xl sm:text-2xl font-black text-[#900020] leading-tight">
              {product.title}
            </h2>

            <div className="mt-3 bg-[#fff5f7] p-3.5 rounded-2xl border border-pink-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#900020] flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#e01e5a]" />
                <span>¿Qué incluye este detalle?</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#900020]/90 font-semibold leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Personalización Opcional antes de ir a WhatsApp */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-[#e01e5a] fill-[#e01e5a]" />
                <span>Dedicatoria para la tarjeta (Opcional):</span>
              </label>
              <input
                type="text"
                value={dedicationNote}
                onChange={(e) => setDedicationNote(e.target.value)}
                placeholder="Ej: ¡Feliz aniversario mi amor! Conmigo siempre serás protagonista..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-pink-200 bg-pink-50/40 text-[#900020] placeholder-[#900020]/45 focus:outline-none focus:border-[#900020] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#e01e5a]" />
                <span>¿Querés agregar fotos Polaroid, llavero o algún dulce extra? (Opcional):</span>
              </label>
              <input
                type="text"
                value={extraRequest}
                onChange={(e) => setExtraRequest(e.target.value)}
                placeholder="Ej: Sumar 4 Polaroids o cambiar gaseosa..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-pink-200 bg-pink-50/40 text-[#900020] placeholder-[#900020]/45 focus:outline-none focus:border-[#900020] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#900020] mb-1">
                Preferencia de entrega en Oberá:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "coordinar", label: "A coordinar" },
                  { id: "envio", label: "Envío a domicilio" },
                  { id: "retiro", label: "Retirar pedido" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryOption(opt.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border transition-all ${
                      deliveryOption === opt.id
                        ? "bg-[#900020] text-white border-[#900020]"
                        : "bg-pink-50/60 text-[#900020] border-pink-200 hover:bg-pink-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="sm:w-2/5 flex items-center justify-center gap-2 bg-pink-100 hover:bg-pink-200 text-[#900020] font-black py-3.5 px-4 rounded-2xl transition-all active:scale-95 text-xs sm:text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sumar al Pedido</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-black py-3.5 px-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              <span className="text-sm sm:text-base">Encargar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
