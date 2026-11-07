"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { OrderCartDrawer } from "@/components/OrderCartDrawer";
import { CatalogSheetsModal } from "@/components/CatalogSheetsModal";
import { WaveDivider, Sparkle, Squiggle } from "@/components/Sparkle";
import { Category, Product, CartItem } from "@/types/database";
import { getCategories, getProducts } from "@/lib/firebase";
import {
  Search,
  Heart,
  MessageCircle,
  Gift,
  Sparkles,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  Images,
  Flame,
  Camera,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrito de pedido para WhatsApp
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCatalogSheetsOpen, setIsCatalogSheetsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "543755583767";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Cargar carrito guardado si existe
    try {
      const savedCart = localStorage.getItem("dulzurabox_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCartState = (nextCart: CartItem[]) => {
    setCart(nextCart);
    try {
      localStorage.setItem("dulzurabox_cart", JSON.stringify(nextCart));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let nextCart: CartItem[];
    if (existing) {
      nextCart = cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      nextCart = [...cart, { product, quantity: 1 }];
    }
    saveCartState(nextCart);
    setToastMessage(`¡"${product.title}" sumado a tu pedido!`);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const nextCart = cart
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    saveCartState(nextCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const nextCart = cart.filter((item) => item.product.id !== productId);
    saveCartState(nextCart);
  };

  const handleClearCart = () => {
    saveCartState([]);
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + (Number(item.product.price) || 0) * item.quantity,
    0
  );

  // Filtrado de productos por categoría y por búsqueda
  const filteredProducts = products.filter((prod) => {
    if (!prod.is_active) return false;
    const matchesCategory =
      selectedCategoryId === null || prod.category_id === selectedCategoryId;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      {/* Elementos decorativos de fondo suaves */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35">
        <div className="absolute top-1/5 -left-16 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-16 w-80 h-80 bg-pink-200 rounded-full blur-3xl" />
      </div>

      {/* Notificación flotante al agregar al pedido */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#900020] text-white text-xs sm:text-sm font-black px-5 py-3 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Cabecera Principal */}
        <Header
          cartCount={totalCartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCatalogSheets={() => setIsCatalogSheetsOpen(true)}
        />

        {/* Sección Principal del Catálogo */}
        <main id="catalogo" className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2 w-full">
          {/* Buscador + Botón de Láminas Oficiales */}
          <div className="max-w-xl mx-auto mb-5 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Buscar ramo hot wheels, caja, polaroid, cuadro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-md text-[#900020] placeholder-[#900020]/50 pl-11 pr-16 py-3 rounded-full border-2 border-white focus:border-[#900020] focus:outline-none shadow-md transition-all font-bold text-xs sm:text-sm"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#900020] absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-black text-[#e01e5a] hover:text-[#900020]"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Categorías */}
          <div className="mb-6">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>

          {/* Grilla de Productos */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#900020]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#900020]" />
              <p className="mt-4 font-extrabold animate-pulse text-sm">
                Preparando el catálogo más dulce de Oberá...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card-cute p-10 text-center max-w-lg mx-auto border-2 border-white">
              <Gift className="w-14 h-14 mx-auto text-[#900020]/40 mb-3" />
              <h3 className="font-sans text-lg sm:text-xl font-black text-[#900020]">
                No encontramos productos con ese filtro
              </h3>
              <p className="text-xs sm:text-sm text-[#900020]/75 font-semibold mt-1.5">
                Probá eligiendo otra categoría o escribinos directo para armar tu regalo a medida.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery("");
                  }}
                  className="bg-[#900020] text-white px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md hover:bg-[#720019] transition-all"
                >
                  Ver todo el catálogo
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "¡Hola DulzuraBox! Quiero consultar por un regalo personalizado en Oberá."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md hover:bg-[#1fb855] transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.category_id);
                const enrichedProduct = { ...product, category };
                return (
                  <ProductCard
                    key={product.id}
                    product={enrichedProduct}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          )}

          {/* Banner Especial: Regalos 100% Personalizados + Visor de Láminas */}
          <section
            id="personalizados"
            className="mt-12 rounded-3xl brush-banner text-white p-6 sm:p-8 md:p-10 shadow-xl border-2 border-white/60 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-6 -right-6 opacity-20">
              <Sparkle size={120} />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Armalo a tu gusto en Oberá</span>
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bubble leading-tight">
                  ¿Querés un regalo 100% personalizado?
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-pink-50 font-semibold leading-relaxed max-w-2xl">
                  A cualquier <strong>Ramo Hot Wheels</strong>, <strong>DulzuraBox</strong> o{" "}
                  <strong>Ramo de Golosinas</strong> podés sumarle fotos <strong>Polaroid</strong>,{" "}
                  cuadros, llaveros, maquillaje, peluches, bebidas o snacks salados. ¡Nos adaptamos a tu presupuesto!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "¡Hola DulzuraBox! ✨ Quiero armar un regalo personalizado a medida en Oberá. ¿Me asesoran?"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                  <span>Armar por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsCatalogSheetsOpen(true)}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-[#900020] font-black py-3 px-6 rounded-2xl shadow-md transition-all text-xs sm:text-sm"
                >
                  <Images className="w-4 h-4 text-[#e01e5a]" />
                  <span>Ver Láminas del Catálogo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Sección Cómo Funciona / Pasos de Compra */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="card-cute p-5 sm:p-6 border-2 border-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#900020] flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                1
              </div>
              <h3 className="font-sans text-base font-black text-[#900020]">
                Elegí tu Detalle Favorito
              </h3>
              <p className="text-xs sm:text-sm text-[#900020]/80 font-semibold mt-1.5">
                Explorá nuestros Ramos Hot Wheels, Cajas DulzuraBox, Ramos Dulces, Polaroids y Cuadros. Podés sumar varios a tu pedido.
              </p>
            </div>

            <div className="card-cute p-5 sm:p-6 border-2 border-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#900020] flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                2
              </div>
              <h3 className="font-sans text-base font-black text-[#900020]">
                Personalizá la Tarjeta y Fotos
              </h3>
              <p className="text-xs sm:text-sm text-[#900020]/80 font-semibold mt-1.5">
                Escribí la dedicatoria especial para la tarjeta e indicanos si querés sumar fotos estilo Polaroid o golosinas extra.
              </p>
            </div>

            <div className="card-cute p-5 sm:p-6 border-2 border-white text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#900020] flex items-center justify-center font-black text-lg mb-3 shadow-xs">
                3
              </div>
              <h3 className="font-sans text-base font-black text-[#900020]">
                Finalizá por WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#900020]/80 font-semibold mt-1.5">
                Con un toque enviás tu pedido al <strong>+54 3755 583767</strong> y coordinamos el pago y la entrega en <strong>Oberá, Misiones</strong>.
              </p>
            </div>
          </section>

          {/* Sección SEO / GEO Local: Preguntas Frecuentes sobre Regalos en Oberá */}
          <section
            id="faq"
            className="mt-12 card-cute p-6 sm:p-8 border-2 border-white"
            aria-label=" Información sobre Regalos Personalizados en Oberá"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#e01e5a] bg-pink-100 px-3.5 py-1 rounded-full mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Regalos en Oberá, Misiones</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bubble text-[#900020]">
                Preguntas Frecuentes • DulzuraBox Oberá
              </h2>
              <p className="text-xs sm:text-sm text-[#900020]/80 font-semibold mt-1 max-w-xl">
                Todo lo que necesitás saber para sorprender a esa persona especial con regalos personalizados en Oberá.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#fff5f7] p-4 rounded-2xl border border-pink-200">
                <h3 className="font-sans text-sm font-black text-[#900020] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#e01e5a] shrink-0" />
                  <span>¿Qué incluyen los Ramos de Hot Wheels en Oberá?</span>
                </h3>
                <p className="text-xs text-[#900020]/85 font-semibold mt-1.5 leading-relaxed">
                  Contamos con 4 opciones de Ramos Hot Wheels (con 1, 2, 3 o 6 autitos Hot Wheels originales) y Cajas DulzuraBox con Hot Wheels. Todos incluyen envoltorio artesanal, moño y tarjeta personalizada a elección.
                </p>
              </div>

              <div className="bg-[#fff5f7] p-4 rounded-2xl border border-pink-200">
                <h3 className="font-sans text-sm font-black text-[#900020] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#e01e5a] shrink-0" />
                  <span>¿Qué diferencia hay entre las Cajas DulzuraBox?</span>
                </h3>
                <p className="text-xs text-[#900020]/85 font-semibold mt-1.5 leading-relaxed">
                  Tenemos DulzuraBox Básica ($14.000), Clásica ($18.000), Premium ($22.000) y Deluxe ($28.000) con chocolates Kinder, Milka, Cofler, Bon o Bon, Sapito, Misky, gomitas ácidas, malvaviscos y bebidas. También armamos cajas saladas o picadas a medida.
                </p>
              </div>

              <div className="bg-[#fff5f7] p-4 rounded-2xl border border-pink-200">
                <h3 className="font-sans text-sm font-black text-[#900020] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#e01e5a] shrink-0" />
                  <span>¿Hacen impresión de fotos Polaroid y Cuadros en Oberá?</span>
                </h3>
                <p className="text-xs text-[#900020]/85 font-semibold mt-1.5 leading-relaxed">
                  ¡Sí! Imprimimos Polaroids individuales ($1.000) y packs por tamaño: 4 fotos de 10x14,5cm ($3.000), 6 fotos de 7x9cm ($3.500) o 20 fotos de 5x5cm ($5.000). Además preparamos cuadros con portarretratos 15x21cm ($14.000) y tamaño A4 ($16.000).
                </p>
              </div>

              <div className="bg-[#fff5f7] p-4 rounded-2xl border border-pink-200">
                <h3 className="font-sans text-sm font-black text-[#900020] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#e01e5a] shrink-0" />
                  <span>¿Cómo encargo y coordino el envío en Oberá?</span>
                </h3>
                <p className="text-xs text-[#900020]/85 font-semibold mt-1.5 leading-relaxed">
                  Elegí tus productos en la web y presioná <strong>&ldquo;Pedir por WhatsApp&rdquo;</strong> o armá tu carrito. Nos llega el detalle directo al <strong>+54 3755 583767</strong> para coordinar las fotos, la tarjeta y la entrega en Oberá, Misiones.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modal de Detalle de Producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Drawer de Carrito / Pedido */}
      <OrderCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Modal de Láminas Oficiales del Catálogo */}
      <CatalogSheetsModal
        isOpen={isCatalogSheetsOpen}
        onClose={() => setIsCatalogSheetsOpen(false)}
      />

      {/* Barra Flotante Inferior en Celulares cuando hay productos en el Pedido */}
      {totalCartItems > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-20 sm:left-auto sm:right-24 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto bg-[#900020] hover:bg-[#720019] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-between sm:justify-center gap-3 transition-all active:scale-95"
          >
            <div className="flex items-center gap-2">
              <span className="bg-[#ff5c8a] text-white text-xs font-black px-2 py-0.5 rounded-full">
                {totalCartItems}
              </span>
              <span className="text-xs sm:text-sm font-black">Ver Mi Pedido</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-pink-200">
              ${totalCartPrice.toLocaleString("es-AR")}
            </span>
          </button>
        </div>
      )}

      {/* Botón Flotante Global de WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          "¡Hola DulzuraBox! ✨ Quiero hacer un pedido personalizado en Oberá."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] hover:bg-[#1fb855] text-white p-3.5 sm:p-4 rounded-full shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Chatear con DulzuraBox por WhatsApp (+54 3755 583767)"
        aria-label="Chatear por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-none" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-black text-sm group-hover:ml-2">
          Hacer Pedido
        </span>
      </a>

      {/* Pie de página con ondas y estilo DulzuraBox */}
      <footer className="relative mt-20 bg-[#900020] text-white text-center pt-8 pb-24 sm:pb-12">
        <WaveDivider
          fill="#900020"
          className="absolute -top-9 sm:-top-14 left-0 w-full rotate-180"
        />

        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-bubble tracking-wide mb-1 text-pink-100">
            Dulzurabox
          </h2>
          <p className="text-xs sm:text-sm text-pink-200 font-extrabold tracking-widest uppercase mb-3">
            Regala detalles, no excusas ✨
          </p>

          <p className="text-xs text-pink-100/90 max-w-md font-semibold mb-4">
            Regalos personalizados en <strong>Oberá, Misiones</strong>: Ramos Hot Wheels, Cajas Dulces, Ramos de Golosinas, Fotos Polaroid y Cuadros.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold mb-6">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +54 3755 583767</span>
            </a>
            <a
              href="https://www.instagram.com/dulzurabox"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full transition-all"
            >
              Instagram: @DULZURABOX
            </a>
          </div>

          <div className="pt-4 border-t border-pink-700/50 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-pink-200 gap-3">
            <p className="flex items-center gap-1.5">
              <span>© 2026 DulzuraBox Oberá. Hecho con</span>
              <Heart className="w-3.5 h-3.5 fill-pink-300 text-pink-300" />
              <span>en Misiones, Argentina.</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCatalogSheetsOpen(true)}
                className="hover:underline font-bold text-pink-100"
              >
                Láminas del Catálogo
              </button>
              <span>•</span>
              <Link href="/admin" className="hover:underline font-extrabold text-white">
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
