"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { OrderCartDrawer } from "@/components/OrderCartDrawer";
import { CatalogSheetsModal } from "@/components/CatalogSheetsModal";
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
  Images,
  Flame,
  Camera,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
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

  const activeCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.name || "Categoría"
    : "Todas las Colecciones";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fff8fa]">
      {/* Notificación flotante al agregar al pedido */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#7A0022] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#ff85a2] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        {/* Cabecera y Hero Principal */}
        <Header
          cartCount={totalCartItems}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCatalogSheets={() => setIsCatalogSheetsOpen(true)}
        />

        {/* Sección Principal del Catálogo */}
        <main id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 w-full">
          {/* Encabezado de Sección + Barra de Búsqueda */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91B5C]">
                Catálogo Oficial DulzuraBox
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b0711] mt-1">
                {activeCategoryName}
              </h2>
            </div>

            {/* Buscador Estilizado */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar Hot Wheels, Kinder, Polaroid, Cuadro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-[#3d0c1a] placeholder-[#9e586d] pl-11 pr-16 py-3 rounded-full border border-[#7A0022]/15 focus:border-[#D91B5C] focus:outline-none shadow-2xs transition-all font-medium text-xs sm:text-sm"
              />
              <Search className="w-4 h-4 text-[#7A0022] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#D91B5C] hover:text-[#7A0022]"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Categorías */}
          <div className="mb-8 pb-2 border-b border-[#7A0022]/10">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>

          {/* Grilla de Productos */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#7A0022]">
              <div className="animate-spin rounded-full h-11 w-11 border-b-3 border-[#7A0022]" />
              <p className="mt-4 font-bold text-sm text-[#6e3043]">
                Cargando catálogo de DulzuraBox...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card-boutique p-12 text-center max-w-lg mx-auto">
              <Gift className="w-12 h-12 mx-auto text-[#D91B5C]/50 mb-3" />
              <h3 className="font-display text-xl font-bold text-[#2b0711]">
                No encontramos productos con ese filtro
              </h3>
              <p className="text-xs sm:text-sm text-[#6e3043] mt-1.5">
                Probá eligiendo otra colección o escribinos por WhatsApp para armar tu regalo a medida.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery("");
                  }}
                  className="bg-[#7A0022] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:bg-[#5c001a] transition-all cursor-pointer"
                >
                  Ver todo el catálogo
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "¡Hola DulzuraBox! Quiero consultar por un regalo personalizado en Oberá."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#fff0f4] text-[#7A0022] border border-[#f8c6d4] px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-[#ffe0e9] transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-[#D91B5C]" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
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
            className="mt-16 rounded-3xl banner-royal text-white p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-pink-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff85a2]" />
                  <span>Diseñado a tu medida en Oberá</span>
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                  ¿Querés personalizar tu caja o ramo desde cero?
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-pink-100/90 leading-relaxed max-w-2xl">
                  A cualquier <strong>Ramo Hot Wheels</strong>, <strong>DulzuraBox</strong> o{" "}
                  <strong>Ramo de Golosinas</strong> podés agregarle fotos <strong>Polaroid</strong>,{" "}
                  cuadros, llaveros, maquillaje, juguetes, picadas saladas o las golosinas que más le gusten. El precio se adapta a lo que elijas agregarle.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    "¡Hola DulzuraBox! ✨ Quiero armar un regalo personalizado a medida en Oberá. ¿Me asesoran?"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-pink-50 text-[#7A0022] font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-98 text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-[#16a34a]" />
                  <span>Cotizar Regalo a Medida</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsCatalogSheetsOpen(true)}
                  className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold py-3 px-6 rounded-2xl transition-all text-xs sm:text-sm cursor-pointer"
                >
                  <Images className="w-4 h-4 text-[#ff85a2]" />
                  <span>Ver Láminas del Catálogo</span>
                </button>
              </div>
            </div>
          </section>

          {/* Sección Cómo Funciona / Pasos de Compra */}
          <section className="mt-16">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#D91B5C]">
                Compra Simple y Rápida
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b0711] mt-1">
                ¿Cómo encargar tu DulzuraBox?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              <div className="card-boutique p-6 sm:p-7 flex flex-col items-start">
                <span className="w-10 h-10 rounded-xl bg-[#fff0f4] text-[#7A0022] border border-[#f8c6d4] flex items-center justify-center font-display font-bold text-base mb-4">
                  01
                </span>
                <h3 className="font-display text-lg font-bold text-[#2b0711]">
                  Elegí tus favoritos
                </h3>
                <p className="text-xs sm:text-sm text-[#6e3043] mt-2 leading-relaxed">
                  Explorá nuestros Ramos Hot Wheels, Cajas DulzuraBox, Ramos Dulces, Polaroids y Cuadros. Podés pedir uno directo o sumar varios a tu bolsa.
                </p>
              </div>

              <div className="card-boutique p-6 sm:p-7 flex flex-col items-start">
                <span className="w-10 h-10 rounded-xl bg-[#fff0f4] text-[#7A0022] border border-[#f8c6d4] flex items-center justify-center font-display font-bold text-base mb-4">
                  02
                </span>
                <h3 className="font-display text-lg font-bold text-[#2b0711]">
                  Sumá tu dedicatoria y fotos
                </h3>
                <p className="text-xs sm:text-sm text-[#6e3043] mt-2 leading-relaxed">
                  Escribí la frase que querés en la tarjeta personalizada e indicanos si deseás agregar fotos Polaroid impresas o algún chocolate extra.
                </p>
              </div>

              <div className="card-boutique p-6 sm:p-7 flex flex-col items-start">
                <span className="w-10 h-10 rounded-xl bg-[#fff0f4] text-[#7A0022] border border-[#f8c6d4] flex items-center justify-center font-display font-bold text-base mb-4">
                  03
                </span>
                <h3 className="font-display text-lg font-bold text-[#2b0711]">
                  Confirmá por WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#6e3043] mt-2 leading-relaxed">
                  Con un clic tu pedido llega listo a nuestro WhatsApp (<strong>+54 3755 583767</strong>) para coordinar el pago y la entrega en <strong>Oberá</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Sección SEO / GEO Local: Preguntas Frecuentes sobre Regalos en Oberá */}
          <section
            id="faq"
            className="mt-16 card-boutique p-6 sm:p-10"
            aria-label="Información sobre Regalos Personalizados en Oberá"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D91B5C] bg-[#fff0f4] px-3.5 py-1 rounded-full mb-2 border border-[#f8c6d4]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Oberá, Misiones</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2b0711]">
                Preguntas Frecuentes
              </h2>
              <p className="text-xs sm:text-sm text-[#6e3043] mt-1 max-w-xl">
                Todo lo que necesitás saber sobre nuestros regalos personalizados en Oberá.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#fff8fa] p-5 rounded-2xl border border-[#7A0022]/10">
                <h3 className="font-display text-sm sm:text-base font-bold text-[#2b0711] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#D91B5C] shrink-0" />
                  <span>¿Qué incluyen los Ramos de Hot Wheels?</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6e3043] mt-2 leading-relaxed">
                  Contamos con 4 versiones de Ramos Hot Wheels (con 1, 2, 3 o 6 autitos originales) y Cajas DulzuraBox con Hot Wheels. Todos incluyen envoltorio especial, moño y tarjeta dedicada a elección.
                </p>
              </div>

              <div className="bg-[#fff8fa] p-5 rounded-2xl border border-[#7A0022]/10">
                <h3 className="font-display text-sm sm:text-base font-bold text-[#2b0711] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#D91B5C] shrink-0" />
                  <span>¿Qué traen las Cajas DulzuraBox?</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6e3043] mt-2 leading-relaxed">
                  Tenemos versiones Básica ($14.000), Clásica ($18.000), Premium ($22.000) y Deluxe ($28.000) con chocolates Kinder, Milka, Cofler, Bon o Bon, Sapito, Misky, gomitas ácidas, malvaviscos y bebidas. También armamos cajas saladas o picadas.
                </p>
              </div>

              <div className="bg-[#fff8fa] p-5 rounded-2xl border border-[#7A0022]/10">
                <h3 className="font-display text-sm sm:text-base font-bold text-[#2b0711] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D91B5C] shrink-0" />
                  <span>¿Imprimen fotos Polaroid y Cuadros en Oberá?</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6e3043] mt-2 leading-relaxed">
                  ¡Sí! Imprimimos Polaroids individuales ($1.000) y packs: 4 fotos de 10x14,5cm ($3.000), 6 fotos de 7x9cm ($3.500) o 20 fotos de 5x5cm ($5.000). Además preparamos cuadros de 15x21cm ($14.000) y tamaño A4 ($16.000).
                </p>
              </div>

              <div className="bg-[#fff8fa] p-5 rounded-2xl border border-[#7A0022]/10">
                <h3 className="font-display text-sm sm:text-base font-bold text-[#2b0711] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D91B5C] shrink-0" />
                  <span>¿Cómo coordino el pago y la entrega?</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6e3043] mt-2 leading-relaxed">
                  Al tocar <strong>&ldquo;Pedir por WhatsApp&rdquo;</strong> o finalizar tu carrito, nos llega el detalle directo al <strong>+54 3755 583767</strong> para que nos envíes tus fotos, el texto de la tarjeta y coordinemos la entrega en Oberá.
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

      {/* Barra Flotante Inferior cuando hay productos en el Pedido */}
      {totalCartItems > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-20 sm:left-auto sm:right-24 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto bg-[#7A0022] hover:bg-[#5c001a] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between sm:justify-center gap-4 transition-all active:scale-95 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="bg-[#D91B5C] text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                {totalCartItems}
              </span>
              <span className="text-xs sm:text-sm font-bold">Ver Mi Pedido</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-pink-200">
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] hover:bg-[#1fb855] text-white p-3.5 sm:p-4 rounded-full shadow-xl border-2 border-white transition-all duration-300 hover:scale-108 active:scale-95 flex items-center justify-center group"
        title="Chatear con DulzuraBox por WhatsApp (+54 3755 583767)"
        aria-label="Chatear por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-none" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-sm group-hover:ml-2">
          WhatsApp
        </span>
      </a>

      {/* Pie de Página Elegante */}
      <footer className="mt-16 bg-[#2b0711] text-pink-50 pt-12 pb-24 sm:pb-12 border-t border-[#7A0022]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="relative w-44 h-16 mb-3">
                <Image
                  src="/img/logo.png"
                  alt="DulzuraBox Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed max-w-xs">
                Regala detalles, no excusas. Regalos personalizados, ramos Hot Wheels, cajas dulces, polaroids y cuadros en Oberá, Misiones.
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-3">
                Colecciones
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-pink-200/80">
                <li>
                  <a href="#catalogo" className="hover:text-white transition-colors">
                    Ramos Edición Hot Wheels
                  </a>
                </li>
                <li>
                  <a href="#catalogo" className="hover:text-white transition-colors">
                    Cajas DulzuraBox (Básica a Deluxe)
                  </a>
                </li>
                <li>
                  <a href="#catalogo" className="hover:text-white transition-colors">
                    Ramos de Chocolates y Gomitas
                  </a>
                </li>
                <li>
                  <a href="#catalogo" className="hover:text-white transition-colors">
                    Fotos Polaroid y Cuadros A4 / 15x21
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-3">
                Contacto en Oberá
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-pink-200/80">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff85a2] shrink-0" />
                  <span>Oberá, Misiones, Argentina</span>
                </p>
                <p>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-bold hover:text-[#ff85a2] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp: +54 3755 583767</span>
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.instagram.com/dulzurabox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram: @dulzurabox
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-pink-200/60 gap-3">
            <p className="flex items-center gap-1.5">
              <span>© 2026 DulzuraBox Oberá. Hecho con</span>
              <Heart className="w-3.5 h-3.5 fill-[#D91B5C] text-[#D91B5C]" />
              <span>en Misiones.</span>
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCatalogSheetsOpen(true)}
                className="hover:text-white transition-colors font-semibold cursor-pointer"
              >
                Ver Láminas Oficiales
              </button>
              <span>•</span>
              <Link href="/admin" className="hover:text-white transition-colors font-semibold">
                Administración
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
