import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Category, Product } from "@/types/database";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "./seed-data";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA-nNGEsLYG1sQembENmSoYnWRTz1bx1Ts",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dulzurabox.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dulzurabox",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dulzurabox.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "554677444372",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:554677444372:web:cb90d179e176b25c9aac01",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-KCS763MNSM",
};

// Inicializar Firebase singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Claves de localStorage para persistencia local y de respaldo
const STORAGE_KEY_CATEGORIES = "dulzurabox_categories_v2";
const STORAGE_KEY_PRODUCTS = "dulzurabox_products_v2";
const STORAGE_KEY_DELETED_CATS = "dulzurabox_deleted_cats_v2";
const STORAGE_KEY_DELETED_PRODS = "dulzurabox_deleted_prods_v2";

function getDeletedIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addDeletedId(key: string, id: string) {
  if (typeof window === "undefined") return;
  const current = getDeletedIds(key);
  if (!current.includes(id)) {
    current.push(id);
    localStorage.setItem(key, JSON.stringify(current));
  }
}

function clearDeletedIds() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_DELETED_CATS);
  localStorage.removeItem(STORAGE_KEY_DELETED_PRODS);
}

function getLocalCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    const parsed: Category[] = JSON.parse(stored);
    const deleted = getDeletedIds(STORAGE_KEY_DELETED_CATS);
    return parsed.filter((c) => !deleted.includes(c.id));
  } catch {
    return INITIAL_CATEGORIES;
  }
}

function getLocalProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    const parsed: Product[] = JSON.parse(stored);
    const deleted = getDeletedIds(STORAGE_KEY_DELETED_PRODS);
    return parsed.filter((p) => !deleted.includes(p.id));
  } catch {
    return INITIAL_PRODUCTS;
  }
}

// -------------------------------------------------------------------------
// CATEGORÍAS (FIRESTORE + LOCAL SYNC)
// -------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  const deletedIds = getDeletedIds(STORAGE_KEY_DELETED_CATS);
  try {
    const catQuery = query(collection(db, "categories"), orderBy("order_index", "asc"));
    const snapshot = await getDocs(catQuery);
    if (!snapshot.empty) {
      const remoteCats = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Category, "id">),
        }))
        .filter((c) => !deletedIds.includes(c.id));

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(remoteCats));
      }
      return remoteCats;
    }
  } catch (err) {
    console.warn("Usando catálogo local para categorías:", err);
  }
  return getLocalCategories();
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const slug = (category.name || "categoria")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

  try {
    if (category.id && !category.id.startsWith("cat-")) {
      const docRef = doc(db, "categories", category.id);
      await setDoc(docRef, { ...category, slug }, { merge: true });
      const saved = { ...category, slug, id: category.id } as Category;
      syncCategoryLocal(saved);
      return saved;
    } else {
      const docRef = await addDoc(collection(db, "categories"), {
        name: category.name || "Nueva Categoría",
        slug,
        order_index: category.order_index || Date.now(),
        created_at: new Date().toISOString(),
      });
      const saved: Category = {
        id: docRef.id,
        name: category.name || "Nueva Categoría",
        slug,
        order_index: category.order_index || 1,
      };
      syncCategoryLocal(saved);
      return saved;
    }
  } catch (err) {
    console.warn("Guardando categoría en almacenamiento local:", err);
    const list = getLocalCategories();
    if (category.id) {
      const updated = list.map((c) => (c.id === category.id ? { ...c, ...category, slug } : c));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
      return { ...category, slug } as Category;
    } else {
      const newCat: Category = {
        id: "cat-" + Date.now(),
        name: category.name || "Nueva Categoría",
        slug,
        order_index: list.length + 1,
      };
      list.push(newCat);
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
      return newCat;
    }
  }
}

function syncCategoryLocal(cat: Category) {
  if (typeof window === "undefined") return;
  const list = getLocalCategories();
  const exists = list.some((c) => c.id === cat.id);
  const next = exists ? list.map((c) => (c.id === cat.id ? cat : c)) : [...list, cat];
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(next));
}

export async function deleteCategory(id: string): Promise<void> {
  addDeletedId(STORAGE_KEY_DELETED_CATS, id);
  try {
    if (!id.startsWith("cat-")) {
      await deleteDoc(doc(db, "categories", id));
    }
  } catch (err) {
    console.warn("Aviso al eliminar categoría remota:", err);
  }
  if (typeof window !== "undefined") {
    const list = getLocalCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
  }
}

// -------------------------------------------------------------------------
// PRODUCTOS (FIRESTORE + LOCAL SYNC)
// -------------------------------------------------------------------------
export async function getProducts(categoryId?: string): Promise<Product[]> {
  const deletedIds = getDeletedIds(STORAGE_KEY_DELETED_PRODS);
  try {
    let prodQuery = query(collection(db, "products"), orderBy("order_index", "asc"));
    if (categoryId) {
      prodQuery = query(
        collection(db, "products"),
        where("category_id", "==", categoryId),
        orderBy("order_index", "asc")
      );
    }
    const snapshot = await getDocs(prodQuery);
    if (!snapshot.empty) {
      const remoteProds = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, "id">),
        }))
        .filter((p) => !deletedIds.includes(p.id));

      if (typeof window !== "undefined" && !categoryId) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(remoteProds));
      }
      return remoteProds;
    }
  } catch (err) {
    console.warn("Usando catálogo local para productos:", err);
  }

  const products = getLocalProducts();
  if (categoryId) {
    return products.filter((p) => p.category_id === categoryId);
  }
  return products;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const cleanProduct = {
    category_id: product.category_id || "",
    title: (product.title || "Nuevo Producto").trim(),
    description: (product.description || "").trim(),
    price: Number(product.price) || 0,
    price_label: (product.price_label || "").trim(),
    badge: (product.badge || "").trim(),
    is_featured: Boolean(product.is_featured),
    image_url: product.image_url || "/img/caja.jpg",
    is_active: product.is_active ?? true,
    order_index: product.order_index ?? Date.now(),
  };

  try {
    if (product.id && !product.id.startsWith("prod-")) {
      const docRef = doc(db, "products", product.id);
      await setDoc(docRef, cleanProduct, { merge: true });
      const saved = { ...cleanProduct, id: product.id };
      syncProductLocal(saved);
      return saved;
    } else {
      const docRef = await addDoc(collection(db, "products"), {
        ...cleanProduct,
        created_at: new Date().toISOString(),
      });
      const saved = { ...cleanProduct, id: docRef.id };
      syncProductLocal(saved);
      return saved;
    }
  } catch (err) {
    console.warn("Guardando producto en almacenamiento local:", err);
    const list = getLocalProducts();
    if (product.id) {
      const updated = list.map((p) =>
        p.id === product.id ? ({ ...p, ...cleanProduct, id: product.id } as Product) : p
      );
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return { ...cleanProduct, id: product.id } as Product;
    } else {
      const newProd: Product = {
        ...cleanProduct,
        id: "prod-" + Date.now(),
        order_index: list.length + 1,
      };
      list.push(newProd);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
      return newProd;
    }
  }
}

function syncProductLocal(prod: Product) {
  if (typeof window === "undefined") return;
  const list = getLocalProducts();
  const exists = list.some((p) => p.id === prod.id);
  const next = exists ? list.map((p) => (p.id === prod.id ? prod : p)) : [...list, prod];
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(next));
}

export async function deleteProduct(id: string): Promise<void> {
  addDeletedId(STORAGE_KEY_DELETED_PRODS, id);
  try {
    if (!id.startsWith("prod-")) {
      await deleteDoc(doc(db, "products", id));
    }
  } catch (err) {
    console.warn("Aviso al eliminar producto remoto:", err);
  }
  if (typeof window !== "undefined") {
    const list = getLocalProducts().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
  }
}

export async function deleteMultipleProducts(ids: string[]): Promise<void> {
  for (const id of ids) {
    await deleteProduct(id);
  }
}

export async function clearAllCatalogData(): Promise<void> {
  try {
    const prodSnap = await getDocs(collection(db, "products"));
    for (const d of prodSnap.docs) {
      addDeletedId(STORAGE_KEY_DELETED_PRODS, d.id);
      await deleteDoc(doc(db, "products", d.id));
    }
  } catch (err) {
    console.warn("Aviso limpiando productos remotos:", err);
  }

  for (const p of INITIAL_PRODUCTS) {
    addDeletedId(STORAGE_KEY_DELETED_PRODS, p.id);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify([]));
  }
}

// -------------------------------------------------------------------------
// STORAGE: SUBIDA DE IMÁGENES A FIREBASE STORAGE
// -------------------------------------------------------------------------
export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (err) {
    console.warn("Error subiendo imagen a Firebase Storage, usando DataURL optimizado local:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// -------------------------------------------------------------------------
// RESTAURAR / SEMBRAR CATÁLOGO OFICIAL DULZURABOX
// -------------------------------------------------------------------------
export async function seedFirebaseDatabase(): Promise<{ success: boolean; message: string }> {
  clearDeletedIds();

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  try {
    // Limpiar anteriores en Firestore para evitar duplicados al restaurar
    const existingProds = await getDocs(collection(db, "products"));
    for (const d of existingProds.docs) {
      await deleteDoc(doc(db, "products", d.id));
    }
    const existingCats = await getDocs(collection(db, "categories"));
    for (const d of existingCats.docs) {
      await deleteDoc(doc(db, "categories", d.id));
    }

    // 1. Insertar Categorías
    const catMap = new Map<string, string>();
    for (const cat of INITIAL_CATEGORIES) {
      const docRef = await addDoc(collection(db, "categories"), {
        name: cat.name,
        slug: cat.slug,
        order_index: cat.order_index,
        created_at: new Date().toISOString(),
      });
      catMap.set(cat.id, docRef.id);
    }

    // 2. Insertar Productos
    for (const prod of INITIAL_PRODUCTS) {
      const targetCatId = catMap.get(prod.category_id) || prod.category_id;
      await addDoc(collection(db, "products"), {
        category_id: targetCatId,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        price_label: prod.price_label || "",
        badge: prod.badge || "",
        is_featured: prod.is_featured || false,
        image_url: prod.image_url,
        is_active: prod.is_active,
        order_index: prod.order_index,
        created_at: new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: "¡Catálogo oficial DulzuraBox restaurado y sincronizado con éxito!",
    };
  } catch (err: any) {
    return {
      success: true,
      message: "Catálogo oficial restaurado en modo local inmediato.",
    };
  }
}
