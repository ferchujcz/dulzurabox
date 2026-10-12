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
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Cargar datos
  const refreshData = async () => {
    try {
      setLoading(true);
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
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

  // Manejador de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (password === fallbackPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("dulzurabox_admin_auth", "true");
    } else {
      setLoginError("Contraseña incorrecta. (Por defecto: " + fallbackPassword + ")");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("dulzurabox_admin_auth");
    setIsAuthenticated(false);
  };

  // -----------------------------------------------------------
  // CRUD CATEGORÍAS
  // -----------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const slug = newCategoryName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
      await saveCategory({
        name: newCategoryName.trim(),
        slug,
        order_index: categories.length + 1,
      });
      setNewCategoryName("");
      setStatusMessage({ type: "success", text: "¡Categoría agregada con éxito a Firebase!" });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  const handleUpdateCategory = async (cat: Category) => {
    if (!editingCategoryName.trim()) return;
    try {
      const slug = editingCategoryName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
      await saveCategory({
        ...cat,
        name: editingCategoryName.trim(),
        slug,
      });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      setStatusMessage({ type: "success", text: "Categoría actualizada." });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      setStatusMessage({ type: "success", text: "Categoría eliminada." });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  // -----------------------------------------------------------
  // CRUD PRODUCTOS
  // -----------------------------------------------------------
  const openNewProductModal = () => {
    setEditingProduct({
      title: "",
      description: "",
      price: 0,
      category_id: categories[0]?.id || "",
      image_url: "/img/caja.jpg",
      is_active: true,
      order_index: products.length + 1,
    });
    setImageFile(null);
    setImagePreview("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
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

      // Subir imagen a Firebase Storage si se seleccionó archivo nuevo
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      await saveProduct({
        ...editingProduct,
        image_url: finalImageUrl,
        price: Number(editingProduct.price),
      });

      setIsProductModalOpen(false);
      setEditingProduct(null);
      setImageFile(null);
      setStatusMessage({ type: "success", text: "¡Producto guardado exitosamente en Firebase!" });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error al guardar producto: " + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      setStatusMessage({ type: "success", text: "Producto eliminado correctamente." });
      refreshData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error: " + err.message });
    }
  };

  // Sembrar datos a Firebase Firestore
  const handleSeedDatabase = async () => {
    if (!confirm("¿Deseas poblar Firebase Firestore con las categorías y productos iniciales del catálogo?")) return;
    setLoading(true);
    const result = await seedFirebaseDatabase();
    setStatusMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    refreshData();
  };

  // -----------------------------------------------------------
  // VISTA: PANTALLA DE LOGIN
  // -----------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#ffb6c1] flex items-center justify-center p-4">
        <div className="card-cute w-full max-w-md p-8 border-2 border-white/80 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-32 h-24 mx-auto relative mb-2">
              <Image
                src="/img/logo.png"
                alt="Logo DulzuraBox"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-[#900020]">Panel de Administración</h1>
            <p className="text-xs text-gray-700 mt-1">DulzuraBox • dulzurabox.com.ar</p>
          </div>

          {loginError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contraseña de Acceso
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#900020] hover:bg-[#720019] text-white font-black py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-pink-100 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-[#900020] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la tienda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // VISTA: PANEL DE ADMINISTRACIÓN
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 flex flex-col">
      {/* Barra Superior */}
      <header className="bg-white border-b border-pink-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-[#900020] font-black text-lg">
              <div className="w-10 h-8 relative">
                <Image src="/img/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bubble text-2xl hidden sm:inline">Dulzurabox</span>
              <span className="text-xs font-sans bg-pink-100 text-[#900020] px-2 py-0.5 rounded-full font-bold">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-gray-700 hover:text-[#900020] flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-all"
            >
              <span>Ver Tienda</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mensaje de estado */}
      {statusMessage && (
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 mt-4 w-full p-3 rounded-xl text-sm flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-bold hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-grow">
        {/* Banner de Firebase Status */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isFirebaseConfigured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">
                Firebase Conectado: <span className="text-[#900020] font-mono">dulzurabox</span>
              </h2>
              <p className="text-xs text-gray-700">
                Firestore Database y Firebase Storage activos. Dominio: <span className="font-bold">dulzurabox.com.ar</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSeedDatabase}
            className="bg-[#900020] hover:bg-[#720019] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sembrar Catálogo Inicial en Firestore</span>
          </button>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-pink-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-3 font-extrabold text-sm border-b-2 transition-all ${
              activeTab === "products"
                ? "border-[#900020] text-[#900020]"
                : "border-transparent text-gray-700 hover:text-gray-900"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-5 py-3 font-extrabold text-sm border-b-2 transition-all ${
              activeTab === "categories"
                ? "border-[#900020] text-[#900020]"
                : "border-transparent text-gray-700 hover:text-gray-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>
        </div>

        {/* ----------------- TAB PRODUCTOS ----------------- */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#900020]">Lista de Productos</h3>
              <button
                onClick={openNewProductModal}
                className="bg-[#900020] hover:bg-[#720019] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-700 font-bold">Cargando productos...</div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-pink-200">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-700">Aún no hay productos registrados.</p>
                <button
                  onClick={openNewProductModal}
                  className="mt-3 text-xs bg-[#900020] text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  Crear el primero
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.category_id);
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-pink-50 rounded-xl overflow-hidden relative flex-shrink-0 border border-pink-100">
                          <Image
                            src={prod.image_url || "/img/caja.jpg"}
                            alt={prod.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <span className="text-[10px] font-bold uppercase bg-pink-100 text-[#900020] px-2 py-0.5 rounded-full">
                            {cat?.name || "Sin Categoría"}
                          </span>
                          <h4 className="text-sm font-extrabold text-gray-900 truncate mt-1">
                            {prod.title}
                          </h4>
                          <p className="text-xs text-gray-700 line-clamp-2 mt-0.5">
                            {prod.description}
                          </p>
                          <p className="text-sm font-black text-[#900020] mt-1">
                            ${Number(prod.price).toLocaleString("es-AR")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <div className="bg-white p-6 rounded-2xl border border-pink-200 shadow-sm h-fit">
              <h3 className="text-base font-black text-[#900020] mb-3 flex items-center gap-2">
                <FolderPlus className="w-5 h-5" />
                <span>Nueva Categoría</span>
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Desayunos Sorpresa"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#900020] hover:bg-[#720019] text-white text-xs font-extrabold py-2.5 rounded-xl shadow transition-all"
                >
                  Agregar Categoría
                </button>
              </form>
            </div>

            {/* Listado de Categorías */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-pink-200 shadow-sm">
              <h3 className="text-base font-black text-[#900020] mb-4">
                Categorías Existentes ({categories.length})
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-pink-50/50 border border-pink-100"
                  >
                    {editingCategoryId === cat.id ? (
                      <div className="flex items-center gap-2 flex-grow mr-2">
                        <input
                          type="text"
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="px-2 py-1 text-xs border border-pink-300 rounded-lg flex-grow"
                        />
                        <button
                          onClick={() => handleUpdateCategory(cat)}
                          className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-lg font-bold"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="text-xs text-gray-700 hover:underline"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-extrabold text-sm text-gray-800">{cat.name}</span>
                          <span className="text-[10px] text-gray-700 ml-2 font-mono">({cat.slug})</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setEditingCategoryName(cat.name);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-pink-200 max-h-[92vh] overflow-y-auto">
            <h3 className="text-xl font-black text-[#900020] mb-4">
              {editingProduct.id ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ramo 1 - Edición Hot Wheels"
                  value={editingProduct.title || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Precio ($ ARS)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="16000"
                    value={editingProduct.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={editingProduct.category_id || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Descripción (Detalle de qué incluye)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Incluye: 1 chocolate, 2 alfajores, dedicatoria..."
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#900020]"
                />
              </div>

              {/* Subida de Imagen */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Foto del Producto (Subir a Firebase Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-pink-50 border border-pink-200 overflow-hidden relative flex-shrink-0">
                    <Image
                      src={imagePreview || editingProduct.image_url || "/img/caja.jpg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-[#900020] font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Elegir archivo del computador</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-gray-700 mt-1">
                      Formatos: JPG, PNG, WebP. Se subirá a <code className="font-mono text-[#900020]">dulzurabox.firebasestorage.app</code>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingProduct.is_active ?? true}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                  className="rounded text-[#900020] focus:ring-[#900020]"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Producto visible en el catálogo (Activo)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-[#900020] hover:bg-[#720019] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      <span>Subiendo imagen a Firebase...</span>
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
    </div>
  );
}
