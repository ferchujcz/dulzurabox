"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { WaveDivider, Sparkle } from "@/components/Sparkle";
import { Category, Product } from "@/types/database";
import { getCategories, getProducts } from "@/lib/supabase";
import { Search, Heart, MessageCircle, Gift, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
      {/* Elementos decorativos de fondo */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-pink-300 rounded-full blur-3xl" />
        <div className="absolute top-3/4 -right-12 w-72 h-72 bg-rose-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Cabecera Principal */}
        <Header />

        {/* Sección de Filtros y Búsqueda */}
        <main className="max-w-6xl mx-auto px-4 py-4 w-full">
          {/* Barra de Búsqueda Amigable */}
          <div className="max-w-md mx-auto mb-6 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar ramo, chocolate, hot wheels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-md text-[#900020] placeholder-[#900020]/50 pl-11 pr-4 py-3 rounded-full border-2 border-white/80 focus:border-[#900020] focus:outline-none shadow-md transition-all font-semibold text-sm"
              />
              <Search className="w-5 h-5 text-[#900020] absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-[#900020]/70 hover:text-[#900020]"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Categorías */}
          <div className="mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
          </div>

          {/* Grilla de Productos */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#900020]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#900020]" />
              <p className="mt-4 font-bold animate-pulse text-sm">
                Cargando el catálogo más dulce...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card-cute p-12 text-center max-w-lg mx-auto border border-pink-200">
              <Gift className="w-16 h-16 mx-auto text-[#900020]/40 mb-3" />
              <h3 className="text-xl font-black text-[#900020]">
                No encontramos productos en esta sección
              </h3>
              <p className="text-sm text-gray-700 mt-2">
                Prueba seleccionando otra categoría o borrando tu búsqueda.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearchQuery("");
                }}
                className="mt-5 bg-[#900020] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-[#720019] transition-all"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.category_id);
                const enrichedProduct = { ...product, category };
                return (
                  <ProductCard
                    key={product.id}
                    product={enrichedProduct}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal de Detalle de Producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Botón Flotante Global de WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola DulzuraBox! Quiero hacer un pedido personalizado.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Chatear con DulzuraBox por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-black text-sm group-hover:ml-2">
          Hacer Pedido
        </span>
      </a>

      {/* Pie de página con ondas y estilo cute */}
      <footer className="relative mt-16 bg-[#900020] text-white text-center pt-8 pb-10">
        <WaveDivider
          fill="#900020"
          className="absolute -top-10 left-0 w-full rotate-180"
        />

        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl font-bubble tracking-wide mb-1">
            Dulzurabox
          </h2>
          <p className="text-xs text-pink-200 font-semibold tracking-wider uppercase mb-4">
            Regala detalles, no excusas
          </p>

          <div className="flex items-center gap-2 text-sm text-pink-100 font-medium">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 fill-pink-300 text-pink-300" />
            <span>para tus momentos especiales</span>
          </div>

          <div className="mt-6 pt-4 border-t border-pink-700/50 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-pink-300 gap-3">
            <p>© 2026 DulzuraBox. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp: 3755-583767
              </a>
              <span>•</span>
              <Link href="/admin" className="hover:underline font-bold text-white">
                Acceso Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
