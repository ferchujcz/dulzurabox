"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CartItem } from "@/types/database";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Heart,
  MapPin,
  User,
  Sparkles,
  Calendar,
} from "lucide-react";

interface OrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function OrderCartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: OrderCartDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [dedicationMessage, setDedicationMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"envio" | "retiro" | "coordinar">("envio");
  const [addressOrDate, setAddressOrDate] = useState("");

  if (!isOpen) return null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.product.price) || 0) * item.quantity,
    0
  );

  const formattedTotal = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(totalAmount);

  const buildWhatsAppCheckoutUrl = () => {
    const lines: string[] = [
      "¡Hola *DulzuraBox*! ✨ Quiero confirmar el siguiente pedido desde la tienda web:",
      "",
    ];

    items.forEach((item, idx) => {
      const subtotal = (Number(item.product.price) || 0) * item.quantity;
      const priceText = item.product.price_label
        ? item.product.price_label
        : `$${subtotal.toLocaleString("es-AR")}`;
      lines.push(`${idx + 1}. *${item.quantity}x ${item.product.title}* (${priceText})`);
    });

    lines.push("");
    lines.push(`💰 *Total estimado:* ${formattedTotal}`);
    lines.push("");

    if (customerName.trim()) {
      lines.push(`👤 *Mi nombre:* ${customerName.trim()}`);
    }

    const methodText =
      deliveryMethod === "envio"
        ? "Envío a domicilio en Oberá"
        : deliveryMethod === "retiro"
        ? "Retirar personalmente en Oberá"
        : "Coordinar entrega";
    lines.push(`📍 *Entrega:* ${methodText}`);

    if (addressOrDate.trim()) {
      lines.push(`📅 *Dirección / Fecha deseada:* ${addressOrDate.trim()}`);
    }

    if (dedicationMessage.trim()) {
      lines.push(`💌 *Dedicatoria para la tarjeta:* "${dedicationMessage.trim()}"`);
    }

    lines.push("");
    lines.push("¿Me confirman disponibilidad y datos para señar/abonar? ¡Muchas gracias! 💖");

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl border-l-2 border-pink-200 flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Carrito */}
        <div className="bg-[#900020] text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/15 p-2 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-black leading-none">Mi Pedido DulzuraBox</h2>
              <p className="text-[11px] text-pink-200 font-semibold mt-0.5">
                Finalizá tu compra directo por WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Carrito */}
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-4 border border-pink-200">
              <ShoppingBag className="w-10 h-10 text-[#900020]/40" />
            </div>
            <h3 className="font-sans text-lg font-black text-[#900020]">
              Tu bolsa de regalos está vacía
            </h3>
            <p className="text-xs text-[#900020]/70 font-semibold mt-1.5 max-w-xs">
              Podés combinar un Ramo Hot Wheels o DulzuraBox con un pack de Fotos Polaroid o Cuadro personalizado.
            </p>
            <button
              onClick={onClose}
              className="mt-5 bg-[#900020] hover:bg-[#720019] text-white font-black text-xs px-6 py-3 rounded-full shadow-md transition-all"
            >
              Explorar el Catálogo
            </button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* Lista de items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#900020]/70">
                  Regalos seleccionados ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
                <button
                  onClick={onClearCart}
                  className="text-[11px] font-bold text-[#e01e5a] hover:underline"
                >
                  Vaciar pedido
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#fff5f7] border border-pink-200/80 shadow-xs"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-pink-100 shrink-0 border border-white">
                    <Image
                      src={product.image_url || "/img/caja.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="font-sans text-xs sm:text-sm font-black text-[#900020] truncate">
                      {product.title}
                    </h4>
                    <p className="text-xs font-extrabold text-[#e01e5a] mt-0.5">
                      ${(Number(product.price) * quantity).toLocaleString("es-AR")}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-pink-200">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="p-1 text-[#900020] hover:bg-pink-50 rounded-md"
                      aria-label="Restar uno"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-[#900020] min-w-[16px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="p-1 text-[#900020] hover:bg-pink-50 rounded-md"
                      aria-label="Sumar uno"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Quitar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Datos rápidos para agilizar el WhatsApp */}
            <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#900020]">
                <Sparkles className="w-4 h-4 text-[#e01e5a]" />
                <span>Personalizá tu entrega en Oberá</span>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#e01e5a]" />
                  <span>Tu Nombre:</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Valentina / Matías"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-[#900020] placeholder-[#900020]/40 focus:outline-none focus:border-[#900020] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#e01e5a]" />
                  <span>Modalidad de entrega:</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "envio", label: "Envío Oberá" },
                    { id: "retiro", label: "Retirar" },
                    { id: "coordinar", label: "A coordinar" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDeliveryMethod(m.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold border transition-all ${
                        deliveryMethod === m.id
                          ? "bg-[#900020] text-white border-[#900020]"
                          : "bg-white text-[#900020] border-pink-200"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#e01e5a]" />
                  <span>Fecha deseada o Barrio / Dirección (Opcional):</span>
                </label>
                <input
                  type="text"
                  value={addressOrDate}
                  onChange={(e) => setAddressOrDate(e.target.value)}
                  placeholder="Ej: Para este viernes a las 18hs / Centro Oberá"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-[#900020] placeholder-[#900020]/40 focus:outline-none focus:border-[#900020] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#900020] mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#e01e5a] fill-[#e01e5a]" />
                  <span>Frase o dedicatoria para la tarjeta (Opcional):</span>
                </label>
                <textarea
                  rows={2}
                  value={dedicationMessage}
                  onChange={(e) => setDedicationMessage(e.target.value)}
                  placeholder="Escribí el mensaje lindo que querés que imprimamos en la tarjeta..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-[#900020] placeholder-[#900020]/40 focus:outline-none focus:border-[#900020] font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pie del Carrito con Botón Directo a WhatsApp +543755583767 */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-pink-200 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#900020]/80">Total Estimado:</span>
              <span className="text-xl font-black text-[#900020]">{formattedTotal}</span>
            </div>

            <a
              href={buildWhatsAppCheckoutUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-black py-3.5 px-5 rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              <span className="text-sm sm:text-base">Finalizar Compra por WhatsApp</span>
            </a>

            <p className="text-[10px] text-center text-[#900020]/70 font-bold">
              Te atenderemos al instante en el +54 3755 583767 para coordinar tu regalo ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
