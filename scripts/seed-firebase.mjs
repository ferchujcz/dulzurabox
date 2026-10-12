import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const firebaseConfig = {
  apiKey: "AIzaSyA-nNGEsLYG1sQembENmSoYnWRTz1bx1Ts",
  authDomain: "dulzurabox.firebaseapp.com",
  projectId: "dulzurabox",
  storageBucket: "dulzurabox.firebasestorage.app",
  messagingSenderId: "554677444372",
  appId: "1:554677444372:web:cb90d179e176b25c9aac01",
  measurementId: "G-KCS763MNSM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function main() {
  console.log("🚀 Iniciando migración de imágenes locales a Firebase Storage y Firestore...");

  const imgDir = path.join(rootDir, "img");
  const uploadedUrls = {};

  async function uploadFile(filePath, remoteName) {
    try {
      const buffer = fs.readFileSync(filePath);
      const isPng = filePath.endsWith(".png");
      const contentType = isPng ? "image/png" : "image/jpeg";
      
      console.log(`📤 Subiendo imagen a Firebase Storage: ${remoteName}...`);
      const storageRef = ref(storage, `catalogo/${remoteName}`);
      const uint8 = new Uint8Array(buffer);
      await uploadBytes(storageRef, uint8, { contentType });
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`✅ Subido: ${remoteName}`);
      return downloadURL;
    } catch (err) {
      console.warn(`⚠️ Aviso al subir ${remoteName}:`, err.message);
      return `/img/${remoteName}`;
    }
  }

  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    for (const file of files) {
      const fullPath = path.join(imgDir, file);
      if (fs.statSync(fullPath).isFile()) {
        const url = await uploadFile(fullPath, file);
        uploadedUrls[file] = url;
      }
    }

    const catalogoSubdir = path.join(imgDir, "catalogo");
    if (fs.existsSync(catalogoSubdir)) {
      const catFiles = fs.readdirSync(catalogoSubdir);
      for (const file of catFiles) {
        const fullPath = path.join(catalogoSubdir, file);
        if (fs.statSync(fullPath).isFile()) {
          const url = await uploadFile(fullPath, `catalogo_${file}`);
          uploadedUrls[`catalogo/${file}`] = url;
        }
      }
    }
  }

  // 1. Insertar Categorías en Firestore
  console.log("📦 Creando categorías en Firestore...");
  const categories = [
    { name: "Hot Wheels", slug: "hot-wheels", order_index: 1 },
    { name: "Cajas DulzuraBox", slug: "cajas-dulzurabox", order_index: 2 },
    { name: "Ramos", slug: "ramos", order_index: 3 },
    { name: "Cuadros y Polaroids", slug: "cuadros-polaroids", order_index: 4 },
  ];

  const catMap = {};
  for (const cat of categories) {
    const docRef = await addDoc(collection(db, "categories"), {
      ...cat,
      created_at: new Date().toISOString(),
    });
    catMap[cat.slug] = docRef.id;
  }

  // 2. Insertar Productos con las URLs de Firebase Storage
  console.log("🧁 Creando productos en Firestore...");
  const sampleProducts = [
    {
      category_id: catMap["hot-wheels"],
      title: "Ramo 1 - Edición Hot Wheels",
      description: "Incluye: 1 Hot Wheel y 1 tarjeta a elección.",
      price: 16000,
      image_url: uploadedUrls["ramohot.jpg"] || "/img/ramohot.jpg",
      is_active: true,
      order_index: 1,
    },
    {
      category_id: catMap["hot-wheels"],
      title: "Ramo 2 - Edición Hot Wheels",
      description: "Incluye: 2 Hot Wheels y 1 tarjeta a elección.",
      price: 25000,
      image_url: uploadedUrls["ramohot.jpg"] || "/img/ramohot.jpg",
      is_active: true,
      order_index: 2,
    },
    {
      category_id: catMap["hot-wheels"],
      title: "Ramo 3 - Edición Hot Wheels",
      description: "Incluye: 3 Hot Wheels y 1 tarjeta a elección.",
      price: 36000,
      image_url: uploadedUrls["ramohot.jpg"] || "/img/ramohot.jpg",
      is_active: true,
      order_index: 3,
    },
    {
      category_id: catMap["hot-wheels"],
      title: "Ramo 4 - Edición Hot Wheels",
      description: "Incluye: 6 Hot Wheels y 1 tarjeta a elección.",
      price: 64000,
      image_url: uploadedUrls["ramohot.jpg"] || "/img/ramohot.jpg",
      is_active: true,
      order_index: 4,
    },
    {
      category_id: catMap["cajas-dulzurabox"],
      title: "DulzuraBox Básica",
      description: "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor simple, 1 chocolate Sapito, chupetines, chicles y caramelos.",
      price: 14000,
      image_url: uploadedUrls["caja1.jpg"] || "/img/caja1.jpg",
      is_active: true,
      order_index: 5,
    },
    {
      category_id: catMap["cajas-dulzurabox"],
      title: "DulzuraBox Clásica",
      description: "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor Milka, 1 Coca de 200ml, 1 chocolate Sapito, 1 chocolate Misky, chicles, chupetines y caramelos.",
      price: 18000,
      image_url: uploadedUrls["csja2.jpg"] || "/img/csja2.jpg",
      is_active: true,
      order_index: 6,
    },
    {
      category_id: catMap["cajas-dulzurabox"],
      title: "DulzuraBox Premium",
      description: "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor Milka, 1 Coca de 200ml, 1 chocolate Sapito, 2 chocolates Misky, 1 chocolate Kinder, 1 barrita de Bon o Bon, 1 bocadito Kooky Bon de Fel Fort, chicles, chupetines y caramelos.",
      price: 22000,
      image_url: uploadedUrls["caja.jpg"] || "/img/caja.jpg",
      is_active: true,
      order_index: 7,
    },
    {
      category_id: catMap["cajas-dulzurabox"],
      title: "DulzuraBox Deluxe",
      description: "Incluye: 1 Chocolate Cofler, 2 chocolates Kinder, 2 alfajores a elección, 1 barrita Bon o Bon, 1 chocolate Sapito, un bocadito Booky Bon de Fel Fort, 2 chocolates Misky, chicles, chupetines, caramelos y una bebida a elección.",
      price: 28000,
      image_url: uploadedUrls["csja2.jpg"] || "/img/csja2.jpg",
      is_active: true,
      order_index: 8,
    },
    {
      category_id: catMap["ramos"],
      title: "Ramo Base",
      description: "Incluye: 1 malvavisco, 2 tipos de gomitas ácidas, 1 chocolate Tita, 1 chocolate Hamlet, 1 Alfajor, 1 chocolate Sapito, 1 paquete de gomitas, chicles y caramelos.",
      price: 14000,
      image_url: uploadedUrls["ramo.jpg"] || "/img/ramo.jpg",
      is_active: true,
      order_index: 9,
    },
    {
      category_id: catMap["ramos"],
      title: "Ramo DulzuraBox Amarillo",
      description: "Incluye: 1 chocolate Cofler, 1 chocolate Block, 1 barra Bon o Bon, 1 chocolate Tita y un Bon o Bon.",
      price: 19000,
      image_url: uploadedUrls["ramo.jpg"] || "/img/ramo.jpg",
      is_active: true,
      order_index: 10,
    },
    {
      category_id: catMap["cuadros-polaroids"],
      title: "Cuadro Polaroid & Chocolates",
      description: "Cuadro con fotos estilo Polaroid impresas y personalizadas más caja de bombones surtidos.",
      price: 24000,
      image_url: uploadedUrls["caja.jpg"] || "/img/caja.jpg",
      is_active: true,
      order_index: 11,
    },
  ];

  for (const prod of sampleProducts) {
    await addDoc(collection(db, "products"), {
      ...prod,
      created_at: new Date().toISOString(),
    });
  }

  console.log("✨ ¡Migración a Firebase completada con éxito!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
