import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkle, Squiggle } from "./Sparkle";
import { MessageCircle, Heart, Lock } from "lucide-react";

export function Header() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  return (
    <header className="relative w-full pt-6 pb-4 px-4 text-center overflow-hidden">
      {/* Estrellitas decorativas flotantes */}
      <div className="absolute top-4 left-6 text-white opacity-80">
        <Sparkle size={28} />
      </div>
      <div className="absolute top-12 left-1/4 text-[#900020] opacity-60">
        <Sparkle size={18} />
      </div>
      <div className="absolute top-6 right-8 text-white opacity-80">
        <Sparkle size={32} />
      </div>
      <div className="absolute top-16 right-1/4 text-[#900020] opacity-50">
        <Sparkle size={20} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Enlace discreto a Admin */}
        <div className="w-full flex justify-end mb-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-[#900020]/70 hover:text-[#900020] bg-white/40 hover:bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full transition-all"
            title="Panel de Administración"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Logo sin fondo (Transparente) */}
        <div className="relative group cursor-pointer animate-float">
          <div className="w-40 sm:w-48 h-32 sm:h-36 relative transition-transform duration-300 group-hover:scale-105 drop-shadow-md">
            <Image
              src="/img/logo.png"
              alt="DulzuraBox Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Eslogan superior */}
        <p className="mt-2 text-sm sm:text-base font-extrabold tracking-wide uppercase text-[#900020] bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
          Regala detalles, no excusas ✨
        </p>

        {/* Subtítulo estilo catálogo con pincelada */}
        <div className="mt-3 inline-flex items-center gap-3">
          <Squiggle className="text-[#900020]" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#900020]/90">
            Catálogo Interactivo
          </span>
          <Squiggle className="text-[#900020]" />
        </div>

        {/* Canales de contacto / WhatsApp rápido */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <span className="bg-white/80 backdrop-blur text-[#900020] font-bold px-3 py-1.5 rounded-full shadow-sm">
            @DULZURABOX
          </span>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola DulzuraBox! Quiero hacer una consulta sobre sus productos.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold px-4 py-1.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>3755-583767</span>
          </a>
        </div>
      </div>
    </header>
  );
}
