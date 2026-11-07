"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category, Product } from "@/types/database";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  getProducts,
  saveProduct,
  deleteProduct,
  deleteMultipleProducts,
  clearAllCatalogData,
  uploadImage,
  seedFirebaseDatabase,
  isFirebaseConfigured,
} from "@/lib/firebase";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  AlertCircle,
  Database,
  Lock,
  LogOut,
  FolderPlus,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

const GALLERY_PRESET_IMAGES = [
  { label: "Ramo Hot Wheels", url: "/img/ramohot.jpg" },
  { label: "Caja DulzuraBox 1", url: "/img/caja1.jpg" },
  { label: "Caja DulzuraBox 2", url: "/img/csja2.jpg" },
  { label: "Caja Premium", url: "/img/caja.jpg" },
  { label: "Ramo Dulce", url: "/img/ramo.jpg" },
  { label: "Lámina Hot Wheels", url: "/img/catalogo/cat1.jpg" },
  { label: "Lámina Cajas", url: "/img/catalogo/cat2.jpg" },
  { label: "Lámina Ramos", url: "/img/catalogo/cat3.jpg" },
  { label: "Lámina Polaroids", url: "/img/catalogo/cat5.jpg" },
  { label: "Lámina Cuadros", url: "/img/catalogo/5073449815580020053.jpg" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtros y Selección Múltiple en Admin
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal de Confirmación de Eliminación Estilizado
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    isDanger?: boolean;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Estados para Modal / Formulario de Producto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados para Formulario de Categoría
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const fallbackPassword = process.env.NEXT_PUBLIC_ADMIN_FALLBACK_PASSWORD || "dulzurabox2026";

  // Verificar sesión persistida
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("dulzurabox_admin_auth");
    if (sessionToken === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-ocultar notificaciones de éxito luego de 4s
  useEffect(() => {
    if (statusMessage?.type === "success") {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Cargar datos
  const refreshData = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
      setSelectedProductIds([]);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Error al cargar los datos: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Manejador de Login con protección anti-fuerza bruta
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secondsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`Demasiados intentos. Espera ${secondsLeft} segundos.`);
      return;
    }

    if (password.trim() === fallbackPassword) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      sessionStorage.setItem("dulzurabox_admin_auth", "true");
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutUntil(Date.now() + 30000);
        setLoginError("Acceso bloqueado por 30 segundos por seguridad.");
      } else {
        setLoginError("Contraseña incorrecta. Verifica tus credenciales.");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dulzurabox_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  // -----------------------------------------------------------
  // CRUD CATEGORÍAS
  // -----------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await saveCategory({
        name: newCategoryName.trim(),
        order_index: categories.length + 1,
      });
      setNewCategoryName("");
      setStatusMessage({ type: "success", text: "¡Categoría creada correctamente!" });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  const handleUpdateCategory = async (cat: Category) => {
    if (!editingCategoryName.trim()) return;
    try {
      await saveCategory({
        ...cat,
        name: editingCategoryName.trim(),
      });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      setStatusMessage({ type: "success", text: "Categoría actualizada." });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  const promptDeleteCategory = (cat: Category) => {
    setConfirmDialog({
      isOpen: true,
      title: `¿Eliminar categoría "${cat.name}"?`,
      description:
        "Esta categoría se quitará de los filtros de la tienda. Los productos asociados seguirán existiendo pero quedarán sin categoría asignada.",
      confirmLabel: "Sí, eliminar categoría",
      isDanger: true,
      onConfirm: async () => {
        await deleteCategory(cat.id);
        setStatusMessage({ type: "success", text: `Categoría "${cat.name}" eliminada.` });
        await refreshData();
      },
    });
  };

  // -----------------------------------------------------------
  // CRUD PRODUCTOS Y ELIMINACIÓN INDIVIDUAL / MASIVA
  // -----------------------------------------------------------
  const openNewProductModal = () => {
    setEditingProduct({
      title: "",
      description: "",
      price: 16000,
      price_label: "",
      badge: "",
      category_id: categories[0]?.id || "cat-1",
      image_url: "/img/ramohot.jpg",
      is_active: true,
      order_index: products.length + 1,
    });
    setImageFile(null);
    setImagePreview("/img/ramohot.jpg");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct({ ...prod });
    setImageFile(null);
    setImagePreview(prod.image_url);
    setIsProductModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setUploadingImage(true);
      let finalImageUrl = editingProduct.image_url || "/img/caja.jpg";

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      await saveProduct({
        ...editingProduct,
        image_url: finalImageUrl,
        price: Number(editingProduct.price) || 0,
      });

      setIsProductModalOpen(false);
      setEditingProduct(null);
      setImageFile(null);
      setStatusMessage({ type: "success", text: "¡Producto guardado exitosamente!" });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error al guardar producto: " + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleProductVisibility = async (prod: Product) => {
    try {
      await saveProduct({
        ...prod,
        is_active: !prod.is_active,
      });
      setStatusMessage({
        type: "success",
        text: !prod.is_active
          ? `"${prod.title}" ahora está visible en la tienda.`
          : `"${prod.title}" se ocultó del catálogo público.`,
      });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error al cambiar visibilidad: " + err.message });
    }
  };

  const promptDeleteSingleProduct = (prod: Product) => {
    setConfirmDialog({
      isOpen: true,
      title: `¿Eliminar "${prod.title}"?`,
      description:
        "Este producto ya cargado se eliminará de forma permanente tanto de la tienda como de la base de datos.",
      confirmLabel: "Sí, eliminar producto",
      isDanger: true,
      onConfirm: async () => {
        await deleteProduct(prod.id);
        setStatusMessage({ type: "success", text: `Producto "${prod.title}" eliminado.` });
        await refreshData();
      },
    });
  };

  const promptDeleteSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: `¿Eliminar ${selectedProductIds.length} productos seleccionados?`,
      description:
        "Todos los productos marcados serán eliminados inmediatamente del catálogo de DulzuraBox.",
      confirmLabel: `Eliminar (${selectedProductIds.length}) productos`,
      isDanger: true,
      onConfirm: async () => {
        await deleteMultipleProducts(selectedProductIds);
        setStatusMessage({
          type: "success",
          text: `Se eliminaron ${selectedProductIds.length} productos correctamente.`,
        });
        await refreshData();
      },
    });
  };

  const promptClearAllProducts = () => {
    setConfirmDialog({
      isOpen: true,
      title: "¿Vaciar todos los productos cargados?",
      description:
        "Esta acción eliminará todos los productos que están actualmente cargados en el catálogo para que puedas empezar de cero o cargar nuevos.",
      confirmLabel: "Sí, vaciar todos los productos",
      isDanger: true,
      onConfirm: async () => {
        await clearAllCatalogData();
        setStatusMessage({
          type: "success",
          text: "Se vaciaron todos los productos del catálogo.",
        });
        await refreshData();
      },
    });
  };

  const promptRestoreOfficialCatalog = () => {
    setConfirmDialog({
      isOpen: true,
      title: "¿Restaurar Catálogo Oficial DulzuraBox?",
      description:
        "Se cargarán las 5 categorías y los 20 productos oficiales de las láminas (Ramos Hot Wheels, Cajas DulzuraBox, Ramos Dulces, Polaroids y Cuadros).",
      confirmLabel: "Restaurar Catálogo Oficial",
      isDanger: false,
      onConfirm: async () => {
        setLoading(true);
        const result = await seedFirebaseDatabase();
        setStatusMessage({
          type: result.success ? "success" : "error",
          text: result.message,
        });
        await refreshData();
      },
    });
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredAdminProducts = products.filter((p) => {
    const matchesCat = adminCategoryFilter === "all" || p.category_id === adminCategoryFilter;
    const matchesText =
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCat && matchesText;
  });

  const toggleSelectAllFiltered = () => {
    if (selectedProductIds.length === filteredAdminProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredAdminProducts.map((p) => p.id));
    }
  };

  // -----------------------------------------------------------
  // VISTA: PANTALLA DE LOGIN ACORDE AL LOGO
  // -----------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#ffb6c1] flex items-center justify-center p-4">
        <div className="card-cute w-full max-w-md p-7 sm:p-8 border-2 border-white shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-44 h-28 mx-auto relative mb-2">
              <Image
                src="/img/logo.png"
                alt="Logo DulzuraBox"
                fill
                className="object-contain drop-shadow"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 bg-pink-100 text-[#900020] text-xs font-black px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e01e5a]" />
              <span>Acceso Seguro de Administración</span>
            </span>
            <p className="text-xs text-[#900020]/75 font-semibold mt-2">
              Gestioná tus productos, precios, fotos y categorías de DulzuraBox Oberá
            </p>
          </div>

          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#900020] mb-1">
                Contraseña de Administrador
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu clave de acceso..."
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-pink-50/30 text-[#900020] focus:outline-none focus:border-[#900020] text-sm font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#900020] hover:bg-[#720019] text-white font-black py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-pink-100 text-center">
            <Link
              href="/"
              className="text-xs font-extrabold text-[#900020] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la tienda DulzuraBox</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // VISTA: PANEL DE ADMINISTRACIÓN COMPLETO
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fff5f7] text-[#900020] flex flex-col">
      {/* Barra Superior */}
      <header className="bg-white border-b-2 border-pink-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 text-[#900020]">
              <div className="w-28 sm:w-32 h-10 relative">
                <Image src="/img/logo.png" alt="Logo DulzuraBox" fill className="object-contain" />
              </div>
              <span className="text-[11px] bg-[#900020] text-white px-2.5 py-0.5 rounded-full font-extrabold">
                Panel Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-extrabold text-[#900020] bg-pink-100 hover:bg-pink-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <span>Ver Tienda</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mensaje de estado */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 w-full">
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-between shadow-sm ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-2 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-black underline ml-4"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-grow space-y-6">
        {/* Tarjeta de Acciones Rápidas de Base de Datos y Limpieza */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-pink-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                isFirebaseConfigured ? "bg-pink-100 text-[#900020]" : "bg-gray-100 text-gray-700"
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-sans text-sm sm:text-base font-black text-[#900020]">
                Gestión de Catálogo DulzuraBox ({products.length} productos activos/cargados)
              </h1>
              <p className="text-xs text-[#900020]/75 font-semibold">
                Podés editar, ocultar o <strong>eliminar cualquier producto ya cargado</strong>, o restaurar las láminas oficiales.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={promptRestoreOfficialCatalog}
              className="flex-1 sm:flex-initial justify-center bg-pink-100 hover:bg-pink-200 text-[#900020] text-xs font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Catálogo Oficial</span>
            </button>

            {products.length > 0 && (
              <button
                type="button"
                onClick={promptClearAllProducts}
                className="flex-1 sm:flex-initial justify-center bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar Todo lo Cargado</span>
              </button>
            )}
          </div>
        </div>

        {/* Pestañas de Navegación + Botón Nuevo Producto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-pink-200 gap-3 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#900020] text-white shadow-md"
                  : "bg-white text-[#900020] hover:bg-pink-100 border border-pink-200"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Productos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "categories"
                  ? "bg-[#900020] text-white shadow-md"
                  : "bg-white text-[#900020] hover:bg-pink-100 border border-pink-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categorías ({categories.length})</span>
            </button>
          </div>

          {activeTab === "products" && (
            <button
              onClick={openNewProductModal}
              className="bg-[#e01e5a] hover:bg-[#900020] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Nuevo Producto</span>
            </button>
          )}
        </div>

        {/* ----------------- TAB PRODUCTOS ----------------- */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Barra de herramientas: Búsqueda, Filtro por Categoría y Eliminación Masiva */}
            <div className="bg-white p-4 rounded-2xl border border-pink-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-grow">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar producto cargado para editar o eliminar..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-pink-200 text-xs sm:text-sm font-semibold text-[#900020] focus:outline-none focus:border-[#900020]"
                  />
                  <Search className="w-4 h-4 text-[#900020]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={adminCategoryFilter}
                  onChange={(e) => setAdminCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-pink-200 text-xs sm:text-sm font-bold text-[#900020] bg-pink-50/40 focus:outline-none focus:border-[#900020]"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-2">
                {filteredAdminProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAllFiltered}
                    className="text-xs font-extrabold text-[#900020] bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {selectedProductIds.length === filteredAdminProducts.length &&
                    filteredAdminProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#e01e5a]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>
                      {selectedProductIds.length === filteredAdminProducts.length
                        ? "Deseleccionar"
                        : "Seleccionar todos"}
                    </span>
                  </button>
                )}

                {selectedProductIds.length > 0 && (
                  <button
                    type="button"
                    onClick={promptDeleteSelectedProducts}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Seleccionados ({selectedProductIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-[#900020] font-black">
                Cargando productos del catálogo...
              </div>
            ) : filteredAdminProducts.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center border-2 border-pink-200">
                <Package className="w-12 h-12 mx-auto text-[#900020]/30 mb-2" />
                <p className="text-sm font-black text-[#900020]">
                  No hay productos que coincidan o el catálogo está vacío.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={openNewProductModal}
                    className="text-xs bg-[#900020] text-white px-4 py-2.5 rounded-xl font-black"
                  >
                    + Crear Nuevo Producto
                  </button>
                  <button
                    onClick={promptRestoreOfficialCatalog}
                    className="text-xs bg-pink-100 text-[#900020] px-4 py-2.5 rounded-xl font-black"
                  >
                    Restaurar Catálogo Inicial
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAdminProducts.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.category_id);
                  const isSelected = selectedProductIds.includes(prod.id);

                  return (
                    <div
                      key={prod.id}
                      className={`bg-white rounded-2xl border-2 p-4 shadow-xs flex flex-col justify-between transition-all ${
                        isSelected
                          ? "border-[#e01e5a] bg-pink-50/30"
                          : prod.is_active
                          ? "border-pink-200/80 hover:border-pink-300"
                          : "border-gray-200 opacity-70"
                      }`}
                    >
                      <div className="flex gap-3.5">
                        {/* Checkbox de selección */}
                        <button
                          type="button"
                          onClick={() => toggleSelectProduct(prod.id)}
                          className="mt-1 text-[#900020] hover:text-[#e01e5a] self-start cursor-pointer"
                          title="Seleccionar producto"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#e01e5a]" />
                          ) : (
                            <Square className="w-5 h-5 text-pink-300" />
                          )}
                        </button>

                        {/* Miniatura */}
                        <div className="w-20 h-20 bg-pink-50 rounded-xl overflow-hidden relative shrink-0 border border-pink-200">
                          <Image
                            src={prod.image_url || "/img/caja.jpg"}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase bg-pink-100 text-[#900020] px-2 py-0.5 rounded-full">
                              {cat?.name || "General"}
                            </span>
                            {prod.badge && (
                              <span className="text-[10px] font-black uppercase bg-[#900020] text-white px-2 py-0.5 rounded-full">
                                {prod.badge}
                              </span>
                            )}
                            {!prod.is_active && (
                              <span className="text-[10px] font-black uppercase bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                Oculto
                              </span>
                            )}
                          </div>

                          <h4 className="font-sans text-sm font-black text-[#900020] truncate mt-1">
                            {prod.title}
                          </h4>
                          <p className="text-xs text-[#900020]/75 font-semibold line-clamp-2 mt-0.5">
                            {prod.description}
                          </p>
                          <p className="text-sm font-black text-[#e01e5a] mt-1">
                            {prod.price_label
                              ? `${prod.price_label} ($${Number(prod.price).toLocaleString("es-AR")})`
                              : `$${Number(prod.price).toLocaleString("es-AR")}`}
                          </p>
                        </div>
                      </div>

                      {/* Botonera de Acciones Directas (Visibilidad, Editar, Eliminar) */}
                      <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductVisibility(prod)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                            prod.is_active
                              ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                          }`}
                          title={prod.is_active ? "Visible en la tienda" : "Oculto en la tienda"}
                        >
                          {prod.is_active ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(prod)}
                            className="px-3 py-1.5 text-xs font-extrabold text-[#900020] bg-pink-50 hover:bg-pink-100 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => promptDeleteSingleProduct(prod)}
                            className="px-3 py-1.5 text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB CATEGORÍAS ----------------- */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Formulario Crear Categoría */}
            <div className="bg-white p-6 rounded-3xl border-2 border-pink-200 shadow-xs h-fit">
              <h3 className="font-sans text-base font-black text-[#900020] mb-3 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#e01e5a]" />
                <span>Nueva Categoría</span>
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#900020] mb-1">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Desayunos / Fechas Especiales"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020] text-sm font-bold text-[#900020]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#900020] hover:bg-[#720019] text-white text-xs font-black py-3 rounded-xl shadow transition-all cursor-pointer"
                >
                  Agregar Categoría
                </button>
              </form>
            </div>

            {/* Listado de Categorías */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border-2 border-pink-200 shadow-xs">
              <h3 className="font-sans text-base font-black text-[#900020] mb-4">
                Categorías Cargadas ({categories.length})
              </h3>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fff5f7] border border-pink-200"
                  >
                    {editingCategoryId === cat.id ? (
                      <div className="flex items-center gap-2 flex-grow mr-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="px-3 py-1.5 text-xs font-bold border border-pink-300 rounded-xl flex-grow bg-white"
                        />
                        <button
                          onClick={() => handleUpdateCategory(cat)}
                          className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl font-black"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="text-xs font-bold text-[#900020] hover:underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-black text-sm text-[#900020]">{cat.name}</span>
                          <span className="text-[11px] text-[#900020]/60 ml-2 font-mono">
                            ({cat.slug})
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setEditingCategoryName(cat.name);
                            }}
                            className="px-2.5 py-1.5 text-xs font-bold text-[#900020] bg-white hover:bg-pink-100 rounded-lg border border-pink-200 flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Renombrar</span>
                          </button>
                          <button
                            onClick={() => promptDeleteCategory(cat)}
                            className="px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- MODAL CREAR / EDITAR PRODUCTO ----------------- */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-pink-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-lg sm:text-xl font-black text-[#900020]">
                {editingProduct.id ? "Editar Producto" : "Cargar Nuevo Producto"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#900020]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#900020] mb-1">
                  Título del Producto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ramo 2 - Edición Hot Wheels"
                  value={editingProduct.title || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-[#900020] mb-1">
                    Precio Numérico ($ ARS)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="25000"
                    value={editingProduct.price ?? ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#900020] mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingProduct.category_id || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category_id: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-[#900020] mb-1">
                    Etiqueta Destacada (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Más Vendido, Favorito, Nuevo"
                    value={editingProduct.badge || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#900020] mb-1">
                    Texto de Precio Variable (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: A medida / Según elección"
                    value={editingProduct.price_label || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price_label: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#900020] mb-1">
                  Descripción (Detalle de qué incluye)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Incluye: 2 Hot Wheels originales y 1 tarjeta a elección..."
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                />
              </div>

              {/* Subida de Imagen o Selección de Galería */}
              <div className="space-y-2.5">
                <label className="block text-xs font-extrabold text-[#900020]">
                  Imagen del Producto
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-pink-50 border-2 border-pink-200 overflow-hidden relative shrink-0">
                    <Image
                      src={imagePreview || editingProduct.image_url || "/img/caja.jpg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-[#900020] font-black text-xs px-4 py-2.5 rounded-xl transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Subir foto desde mi celular / PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-[#900020]/70 font-semibold">
                      O elegí una de las fotos rápidas de la tienda abajo:
                    </p>
                  </div>
                </div>

                {/* Galería rápida de imágenes precargadas */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {GALLERY_PRESET_IMAGES.map((imgItem) => (
                    <button
                      key={imgItem.url}
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(imgItem.url);
                        setEditingProduct({ ...editingProduct, image_url: imgItem.url });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black whitespace-nowrap border transition-all ${
                        (imagePreview || editingProduct.image_url) === imgItem.url
                          ? "bg-[#900020] text-white border-[#900020]"
                          : "bg-pink-50 text-[#900020] border-pink-200 hover:bg-pink-100"
                      }`}
                    >
                      {imgItem.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingProduct.is_active ?? true}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, is_active: e.target.checked })
                  }
                  className="rounded text-[#900020] focus:ring-[#900020] w-4 h-4"
                />
                <label htmlFor="is_active" className="text-xs font-extrabold text-[#900020] cursor-pointer">
                  Producto visible en el catálogo público
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-[#900020] hover:bg-pink-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-[#900020] hover:bg-[#720019] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Producto</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ----------------- */}
      {confirmDialog && confirmDialog.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-pink-200 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
                confirmDialog.isDanger
                  ? "bg-red-100 text-red-600"
                  : "bg-pink-100 text-[#900020]"
              }`}
            >
              {confirmDialog.isDanger ? (
                <Trash2 className="w-7 h-7" />
              ) : (
                <Sparkles className="w-7 h-7" />
              )}
            </div>

            <h3 className="font-sans text-lg font-black text-[#900020]">
              {confirmDialog.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#900020]/80 font-semibold leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#900020] bg-pink-50 hover:bg-pink-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  await action();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white shadow-md transition-all cursor-pointer ${
                  confirmDialog.isDanger
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#900020] hover:bg-[#720019]"
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
