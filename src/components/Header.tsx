import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkle, Squiggle } from "./Sparkle";
import { MessageCircle, Lock, MapPin, ShoppingBag, Images, Sparkles } from "lucide-react";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCatalogSheets?: () => void;
}

export function Header({ cartCount = 0, onOpenCart, onOpenCatalogSheets }: HeaderProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  return (
    <header className="relative w-full pt-4 pb-6 px-4 text-center overflow-hidden">
      {/* Estrellitas decorativas flotantes inspiradas en el logo */}
      <div className="pointer-events-none absolute top-6 left-4 sm:left-12 text-white opacity-90">
        <Sparkle size={26} />
      </div>
      <div className="pointer-events-none absolute top-20 left-8 sm:left-1/4 text-[#900020] opacity-50">
        <Sparkle size={16} />
      </div>
      <div className="pointer-events-none absolute top-8 right-6 sm:right-14 text-white opacity-90">
        <Sparkle size={30} />
      </div>
      <div className="pointer-events-none absolute top-24 right-8 sm:right-1/4 text-[#900020] opacity-40">
        <Sparkle size={18} />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Barra Superior de Navegación Rápida */}
        <div className="w-full flex items-center justify-between gap-2 mb-3">
          {/* Ubicación GEO Badge */}
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#900020] bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white">
            <MapPin className="w-3.5 h-3.5 text-[#e01e5a] shrink-0" />
            <span>Oberá, Misiones</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCatalogSheets && (
              <button
                onClick={onOpenCatalogSheets}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#900020] bg-white/80 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white transition-all active:scale-95"
                title="Ver láminas del catálogo"
              >
                <Images className="w-3.5 h-3.5 text-[#e01e5a]" />
                <span className="hidden xs:inline">Láminas</span>
                <span>Catálogo</span>
              </button>
            )}

            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-white bg-[#900020] hover:bg-[#720019] px-3.5 py-1.5 rounded-full shadow-md transition-all active:scale-95"
                title="Ver mi pedido"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Mi Pedido</span>
                {cartCount > 0 && (
                  <span className="bg-[#ff5c8a] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#900020]/80 hover:text-[#900020] bg-white/50 hover:bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full transition-all"
              title="Panel de Administración"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>

        {/* Logo Oficial sin fondo (el logo ya incluye el eslogan y el nombre Dulzurabox) */}
        <div className="relative group cursor-pointer animate-float my-1">
          <div className="w-64 sm:w-80 md:w-96 h-36 sm:h-44 md:h-48 relative transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_10px_15px_rgba(144,0,32,0.18)]">
            <Image
              src="/img/logo.png"
              alt="DulzuraBox - Regalos Personalizados en Oberá, Misiones - Regala detalles, no excusas"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Subtítulo estilo catálogo con pincelada */}
        <div className="mt-1 inline-flex items-center gap-2 sm:gap-3 bg-white/65 backdrop-blur-md px-5 py-1.5 rounded-full shadow-sm border border-white/80">
          <Squiggle className="text-[#e01e5a] w-10 sm:w-14" />
          <h1 className="font-sans text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.2em] text-[#900020]">
            Catálogo de Regalos Personalizados
          </h1>
          <Squiggle className="text-[#e01e5a] w-10 sm:w-14" />
        </div>

        {/* Texto descriptivo corto para clientes y SEO Local */}
        <p className="mt-2.5 max-w-xl text-xs sm:text-sm font-bold text-[#900020]/90 px-2 leading-relaxed">
          Ramos de <span className="underline decoration-[#e01e5a] decoration-2">Hot Wheels</span>, Cajas Dulces{" "}
          <span className="underline decoration-[#e01e5a] decoration-2">DulzuraBox</span>, Ramos de Golosinas, Fotos{" "}
          <span className="underline decoration-[#e01e5a] decoration-2">Polaroid</span> y Cuadros en{" "}
          <strong>Oberá, Misiones</strong> ✨
        </p>

        {/* Canales de contacto / WhatsApp rápido */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
          <a
            href="https://www.instagram.com/dulzurabox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#900020] font-extrabold px-4 py-2 rounded-full shadow-sm border border-pink-200 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e01e5a]" />
            <span>@DULZURABOX</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "¡Hola DulzuraBox! ✨ Vi su catálogo web y quiero consultar por un regalo personalizado en Oberá."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-black px-5 py-2 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>WhatsApp: 3755-583767</span>
          </a>
        </div>
      </div>
    </header>
  );
}
