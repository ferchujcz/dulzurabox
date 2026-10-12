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

// Fallbacks de localStorage para trabajo offline o demostración
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
// CATEGORÍAS (FIRESTORE)
// -------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  try {
    const catQuery = query(collection(db, "categories"), orderBy("order_index", "asc"));
    const snapshot = await getDocs(catQuery);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Category, "id">),
      }));
    }
  } catch (err) {
    console.warn("Aviso al obtener categorías de Firestore, usando fallback local:", err);
  }
  return getLocalCategories();
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  try {
    const slug = (category.name || "categoria")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    if (category.id && !category.id.startsWith("cat-")) {
      const docRef = doc(db, "categories", category.id);
      await setDoc(docRef, { ...category, slug }, { merge: true });
      return { ...category, slug, id: category.id } as Category;
    } else {
      const docRef = await addDoc(collection(db, "categories"), {
        name: category.name || "Nueva Categoría",
        slug,
        order_index: category.order_index || Date.now(),
        created_at: new Date().toISOString(),
      });
      return {
        id: docRef.id,
        name: category.name || "Nueva Categoría",
        slug,
        order_index: category.order_index || 1,
      };
    }
  } catch (err) {
    console.warn("Guardando categoría en almacenamiento local:", err);
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
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (err) {
    console.warn("Eliminando categoría local:", err);
  }
  const list = getLocalCategories().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
}

// -------------------------------------------------------------------------
// PRODUCTOS (FIRESTORE)
// -------------------------------------------------------------------------
export async function getProducts(categoryId?: string): Promise<Product[]> {
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
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Product, "id">),
      }));
    }
  } catch (err) {
    console.warn("Aviso al obtener productos de Firestore, usando fallback local:", err);
  }

  const products = getLocalProducts();
  if (categoryId) {
    return products.filter((p) => p.category_id === categoryId);
  }
  return products;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  try {
    const cleanProduct = {
      category_id: product.category_id || "",
      title: product.title || "Nuevo Producto",
      description: product.description || "",
      price: Number(product.price) || 0,
      image_url: product.image_url || "/img/caja.jpg",
      is_active: product.is_active ?? true,
      order_index: product.order_index ?? Date.now(),
    };

    if (product.id && !product.id.startsWith("prod-")) {
      const docRef = doc(db, "products", product.id);
      await setDoc(docRef, cleanProduct, { merge: true });
      return { ...cleanProduct, id: product.id };
    } else {
      const docRef = await addDoc(collection(db, "products"), {
        ...cleanProduct,
        created_at: new Date().toISOString(),
      });
      return { ...cleanProduct, id: docRef.id };
    }
  } catch (err) {
    console.warn("Guardando producto en almacenamiento local:", err);
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
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "products", id));
  } catch (err) {
    console.warn("Eliminando producto local:", err);
  }
  const list = getLocalProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
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
    console.warn("Error subiendo imagen a Firebase Storage, usando DataURL local:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// -------------------------------------------------------------------------
// SEED AUTOMÁTICO A FIRESTORE
// -------------------------------------------------------------------------
export async function seedFirebaseDatabase(): Promise<{ success: boolean; message: string }> {
  try {
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
      const targetCatId = catMap.get(prod.category_id) || "";
      await addDoc(collection(db, "products"), {
        category_id: targetCatId,
        title: prod.title,
        description: prod.description,
        price: prod.price,
        image_url: prod.image_url,
        is_active: prod.is_active,
        order_index: prod.order_index,
        created_at: new Date().toISOString(),
      });
    }

    return { success: true, message: "¡Base de datos sembrada con éxito en Firebase Firestore!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Error al sembrar datos en Firebase" };
  }
}
