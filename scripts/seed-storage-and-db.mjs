import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Cargar variables de entorno desde .env.local
function loadEnv() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("tu-proyecto")) {
  console.error("❌ ERROR: Debes configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local antes de correr este script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("🚀 Iniciando migración de imágenes locales y datos iniciales a Supabase...");

  // 1. Subir imágenes de la carpeta img/ al bucket 'products'
  const imgDir = path.join(rootDir, "img");
  const uploadedUrls = {};

  async function uploadFile(filePath, remoteName) {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";
    
    console.log(`📤 Subiendo imagen: ${remoteName}...`);
    const { data, error } = await supabase.storage
      .from("products")
      .upload(`catalogo/${remoteName}`, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn(`⚠️ Aviso al subir ${remoteName}:`, error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(`catalogo/${remoteName}`);

    return publicUrlData.publicUrl;
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

  console.log("✅ Imágenes subidas con éxito a Supabase Storage.");

  // 2. Insertar Categorías
  console.log("📦 Insertando categorías...");
  const categories = [
    { name: "Hot Wheels", slug: "hot-wheels", order_index: 1 },
    { name: "Cajas DulzuraBox", slug: "cajas-dulzurabox", order_index: 2 },
    { name: "Ramos", slug: "ramos", order_index: 3 },
    { name: "Cuadros y Polaroids", slug: "cuadros-polaroids", order_index: 4 },
  ];

  const { data: createdCategories, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select();

  if (catError) {
    console.error("❌ Error al insertar categorías:", catError.message);
    process.exit(1);
  }

  const catMap = {};
  createdCategories.forEach((c) => {
    catMap[c.slug] = c.id;
  });

  // 3. Insertar Productos con las URLs de Supabase Storage
  console.log("🧁 Insertando productos con las URLs del Storage...");
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

  const { error: prodError } = await supabase.from("products").insert(sampleProducts);
  if (prodError) {
    console.error("❌ Error al insertar productos:", prodError.message);
    process.exit(1);
  }

  console.log("✨ ¡Migración completada con éxito! Tu catálogo en Supabase está listo.");
}

main().catch((err) => {
  console.error("Error inesperado:", err);
  process.exit(1);
});
