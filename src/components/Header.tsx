"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkle } from "./Sparkle";
import {
  MessageCircle,
  Lock,
  MapPin,
  ShoppingBag,
  Images,
  Sparkles,
  CheckCircle2,
  Gift,
} from "lucide-react";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenCatalogSheets?: () => void;
}

export function Header({ cartCount = 0, onOpenCart, onOpenCatalogSheets }: HeaderProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  return (
    <div className="w-full">
      {/* Cinta Superior de Anuncio / Ubicación */}
      <div className="bg-[#7A0022] text-pink-50 text-[11px] sm:text-xs font-semibold py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#ff85a2] shrink-0" />
            <span>
              Entregas y envíos en <strong className="text-white">Oberá, Misiones</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-[#ff85a2]" />
            <span>Ramos Hot Wheels • Cajas DulzuraBox • Polaroids • Cuadros</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/dulzurabox"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>@dulzurabox</span>
            </a>
            <span className="opacity-30">|</span>
            <Link
              href="/admin"
              className="hover:text-white transition-colors inline-flex items-center gap-1 text-pink-200/90"
              title="Panel de Administración"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar Sticky con Glassmorphism */}
      <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-[#7A0022]/10 shadow-[0_4px_20px_-10px_rgba(122,0,34,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo en Navbar */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-32 sm:w-40 h-11 sm:h-13 transition-transform duration-300 group-hover:scale-103">
              <Image
                src="/img/logo.png"
                alt="DulzuraBox Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </a>

          {/* Enlaces centrales en Desktop */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-bold text-[#521525]">
            <a href="#catalogo" className="hover:text-[#D91B5C] transition-colors">
              Catálogo
            </a>
            <a href="#personalizados" className="hover:text-[#D91B5C] transition-colors">
              Personalizados
            </a>
            {onOpenCatalogSheets && (
              <button
                type="button"
                onClick={onOpenCatalogSheets}
                className="hover:text-[#D91B5C] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Images className="w-4 h-4 text-[#D91B5C]" />
                <span>Revistas de Precios</span>
              </button>
            )}
            <a href="#faq" className="hover:text-[#D91B5C] transition-colors">
              Preguntas Frecuentes
            </a>
          </div>

          {/* Botones de Acción Derecha */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenCatalogSheets && (
              <button
                type="button"
                onClick={onOpenCatalogSheets}
                className="lg:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#7A0022] bg-[#fff0f4] hover:bg-[#ffe0e9] border border-[#f8c6d4] px-3 py-2 rounded-full transition-all active:scale-95 cursor-pointer"
                title="Ver láminas del catálogo"
              >
                <Images className="w-3.5 h-3.5 text-[#D91B5C]" />
                <span>Láminas</span>
              </button>
            )}

            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7A0022] bg-[#fff0f4] hover:bg-[#ffe0e9] border border-[#f8c6d4] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all active:scale-95 cursor-pointer"
                title="Ver mi bolsa de pedido"
              >
                <ShoppingBag className="w-4 h-4 text-[#D91B5C]" />
                <span className="hidden xs:inline">Mi Pedido</span>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full transition-all ${
                    cartCount > 0
                      ? "bg-[#7A0022] text-white"
                      : "bg-[#f8c6d4]/60 text-[#7A0022]"
                  }`}
                >
                  {cartCount}
                </span>
              </button>
            )}

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "¡Hola DulzuraBox! ✨ Quiero consultar por un regalo personalizado en Oberá."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#7A0022] hover:bg-[#5a0019] px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>3755-583767</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Boutique Principal */}
      <header className="relative hero-brand-gradient pt-6 pb-10 sm:pt-10 sm:pb-14 px-4 sm:px-6 overflow-hidden border-b border-[#f5d0dc]">
        {/* Destellos decorativos sutiles */}
        <div className="pointer-events-none absolute top-10 left-10 text-[#D91B5C]/30 hidden sm:block">
          <Sparkle size={28} />
        </div>
        <div className="pointer-events-none absolute bottom-12 left-1/3 text-[#7A0022]/20 hidden sm:block">
          <Sparkle size={20} />
        </div>
        <div className="pointer-events-none absolute top-14 right-12 text-[#D91B5C]/35 hidden sm:block">
          <Sparkle size={32} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Columna Izquierda: Identidad de Marca + Propuesta de Valor */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Pill de Categoría Local */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#f5c2d1] shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#D91B5C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#7A0022]">
                Tienda de Regalos Personalizados • Oberá, Misiones
              </span>
            </div>

            {/* Logo Principal Destacado sobre el fondo pastel que le pertenece */}
            <div className="relative w-64 sm:w-80 md:w-96 h-32 sm:h-40 mb-2 animate-float">
              <Image
                src="/img/logo.png"
                alt="DulzuraBox - Regala detalles, no excusas"
                fill
                priority
                className="object-contain lg:object-left drop-shadow-[0_12px_20px_rgba(122,0,34,0.12)]"
              />
            </div>

            {/* Título Editorial Complementario */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#3d0c1a] tracking-tight leading-[1.2] max-w-2xl">
              Detalles únicos hechos a mano para sorprender a quien más querés.
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#6e3043] font-medium leading-relaxed max-w-xl">
              Elegí entre nuestros famosos <strong className="text-[#7A0022]">Ramos de Hot Wheels</strong>,{" "}
              <strong className="text-[#7A0022]">Cajas DulzuraBox</strong>,{" "}
              <strong className="text-[#7A0022]">Ramos de Golosinas</strong>,{" "}
              <strong className="text-[#7A0022]">Fotos Polaroid</strong> y{" "}
              <strong className="text-[#7A0022]">Cuadros</strong>. Personalizamos tu tarjeta sin cargo.
            </p>

            {/* Botones de Llamado a la Acción */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <a
                href="#catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7A0022] hover:bg-[#5c001a] text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-[#7A0022]/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Gift className="w-4 h-4 text-[#ff85a2]" />
                <span>Explorar el Catálogo</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  "¡Hola DulzuraBox! ✨ Vi su tienda web y quiero encargar un regalo personalizado en Oberá."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fff0f4] text-[#7A0022] border-2 border-[#7A0022]/15 font-bold text-sm px-6 py-3.5 rounded-full shadow-xs transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#16a34a]" />
                <span>Pedir a Medida por WhatsApp</span>
              </a>
            </div>

            {/* Puntos de confianza */}
            <div className="mt-7 pt-5 border-t border-[#7A0022]/10 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D91B5C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#521525]">
                  Tarjeta dedicada incluida
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D91B5C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#521525]">
                  100% Personalizables
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D91B5C] shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#521525]">
                  Atención por WhatsApp
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Collage Visual de Productos Reales */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* Tarjeta Principal Izquierda (Ramo Hot Wheels) */}
                <div className="col-span-7 relative group">
                  <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-white rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/img/ramohot.jpg"
                      alt="Ramo Hot Wheels DulzuraBox Oberá"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#D91B5C] px-2 py-0.5 rounded-full">
                        Más Pedido
                      </span>
                      <p className="font-display text-sm sm:text-base font-bold mt-1">
                        Ramos Hot Wheels
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dos Tarjetas Derecha Apiladas (Ramo Dulce y Caja DulzuraBox) */}
                <div className="col-span-5 space-y-3 sm:space-y-4">
                  <div className="relative h-32 sm:h-38 rounded-2xl overflow-hidden shadow-lg border-3 border-white rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/img/ramo.jpg"
                      alt="Ramo de Golosinas y Gomitas DulzuraBox"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2.5 right-2 text-white text-xs font-bold">
                      Ramos Dulces
                    </p>
                  </div>

                  <div className="relative h-32 sm:h-38 rounded-2xl overflow-hidden shadow-lg border-3 border-white rotate-[1deg] hover:rotate-0 transition-transform duration-500">
                    <Image
                      src="/img/caja.jpg"
                      alt="Caja DulzuraBox Premium"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <p className="absolute bottom-2 left-2.5 right-2 text-white text-xs font-bold">
                      Cajas DulzuraBox
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
