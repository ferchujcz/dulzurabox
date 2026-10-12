import { createClient } from "@supabase/supabase-js";
import { Category, Product } from "@/types/database";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "./seed-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("tu-proyecto")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Claves de localStorage para cuando se use el modo de demostración local
const STORAGE_KEY_CATEGORIES = "dulzurabox_categories";
const STORAGE_KEY_PRODUCTS = "dulzurabox_products";

function getLocalCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

// -------------------------------------------------------------------------
// CATEGORÍAS
// -------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  }
  return getLocalCategories();
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  if (supabase) {
    if (category.id && !category.id.startsWith("cat-")) {
      const { data, error } = await supabase
        .from("categories")
        .update(category)
        .eq("id", category.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { id, ...newCat } = category;
      const { data, error } = await supabase
        .from("categories")
        .insert([newCat])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  // Fallback Local
  const list = getLocalCategories();
  if (category.id) {
    const updated = list.map((c) => (c.id === category.id ? { ...c, ...category } : c));
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
    return category as Category;
  } else {
    const newCat: Category = {
      id: "cat-" + Date.now(),
      name: category.name || "Nueva Categoría",
      slug: (category.name || "nueva").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      order_index: list.length + 1,
    };
    list.push(newCat);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
    return newCat;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const list = getLocalCategories().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
}

// -------------------------------------------------------------------------
// PRODUCTOS
// -------------------------------------------------------------------------
export async function getProducts(categoryId?: string): Promise<Product[]> {
  if (supabase) {
    let query = supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("order_index", { ascending: true });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as Product[];
    }
  }

  const products = getLocalProducts();
  if (categoryId) {
    return products.filter((p) => p.category_id === categoryId);
  }
  return products;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  if (supabase) {
    if (product.id && !product.id.startsWith("prod-")) {
      const { category, ...cleanProduct } = product as any;
      const { data, error } = await supabase
        .from("products")
        .update(cleanProduct)
        .eq("id", product.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { id, category, ...cleanProduct } = product as any;
      const { data, error } = await supabase
        .from("products")
        .insert([cleanProduct])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  // Fallback Local
  const list = getLocalProducts();
  if (product.id) {
    const updated = list.map((p) => (p.id === product.id ? { ...p, ...product } : p));
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    return product as Product;
  } else {
    const newProd: Product = {
      id: "prod-" + Date.now(),
      category_id: product.category_id || "cat-1",
      title: product.title || "Nuevo Producto",
      description: product.description || "",
      price: Number(product.price) || 0,
      image_url: product.image_url || "/img/caja.jpg",
      is_active: product.is_active ?? true,
      order_index: list.length + 1,
    };
    list.push(newProd);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
    return newProd;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const list = getLocalProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
}

// -------------------------------------------------------------------------
// STORAGE: SUBIDA DE IMÁGENES
// -------------------------------------------------------------------------
export async function uploadImage(file: File): Promise<string> {
  if (supabase) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Fallback: Si no está Supabase conectado, creamos una URL de objeto en base64 para previsualizar localmente
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------------------
// SEED AUTOMÁTICO A SUPABASE
// -------------------------------------------------------------------------
export async function seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return {
      success: false,
      message: "Supabase no está configurado aún. Agrega tus credenciales en el archivo .env.local",
    };
  }

  try {
    // 1. Insertar Categorías
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .upsert(
        INITIAL_CATEGORIES.map((c) => ({
          name: c.name,
          slug: c.slug,
          order_index: c.order_index,
        })),
        { onConflict: "slug" }
      )
      .select();

    if (catError) throw catError;

    // Crear mapa de categorías creadas
    const catMap = new Map<string, string>();
    catData?.forEach((c) => {
      catMap.set(c.slug, c.id);
    });

    // 2. Insertar Productos
    const productsToInsert = INITIAL_PRODUCTS.map((p) => {
      let slug = "cajas-dulzurabox";
      if (p.category_id === "cat-1") slug = "hot-wheels";
      if (p.category_id === "cat-3") slug = "ramos";
      if (p.category_id === "cat-4") slug = "cuadros-polaroids";

      const catId = catMap.get(slug) || catData?.[0]?.id;

      return {
        category_id: catId,
        title: p.title,
        description: p.description,
        price: p.price,
        image_url: p.image_url,
        is_active: p.is_active,
        order_index: p.order_index,
      };
    });

    const { error: prodError } = await supabase.from("products").insert(productsToInsert);
    if (prodError) throw prodError;

    return { success: true, message: "¡Base de datos sembrada con éxito en Supabase!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Error al sembrar datos en Supabase" };
  }
}
