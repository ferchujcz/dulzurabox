import { Category, Product } from "@/types/database";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Hot Wheels",
    slug: "hot-wheels",
    order_index: 1,
  },
  {
    id: "cat-2",
    name: "Cajas DulzuraBox",
    slug: "cajas-dulzurabox",
    order_index: 2,
  },
  {
    id: "cat-3",
    name: "Ramos Dulces",
    slug: "ramos",
    order_index: 3,
  },
  {
    id: "cat-4",
    name: "Polaroids",
    slug: "polaroids",
    order_index: 4,
  },
  {
    id: "cat-5",
    name: "Cuadros",
    slug: "cuadros",
    order_index: 5,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- CATEGORÍA 1: HOT WHEELS ---
  {
    id: "prod-1",
    category_id: "cat-1",
    title: "Ramo 1 - Edición Hot Wheels",
    description:
      "Incluye: 1 Hot Wheel original y 1 tarjeta a elección con dedicatoria. Presentación especial con papel coreano/seda y moño decorativo.",
    price: 16000,
    image_url: "/img/ramohot.jpg",
    is_active: true,
    is_featured: true,
    badge: "Favorito",
    order_index: 1,
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    title: "Ramo 2 - Edición Hot Wheels",
    description:
      "Incluye: 2 Hot Wheels originales y 1 tarjeta a elección con frase personalizada (Ej: 'Conmigo tú siempre serás protagonista').",
    price: 25000,
    image_url: "/img/ramohot.jpg",
    is_active: true,
    is_featured: true,
    badge: "Más Vendido",
    order_index: 2,
  },
  {
    id: "prod-3",
    category_id: "cat-1",
    title: "Ramo 3 - Edición Hot Wheels",
    description:
      "Incluye: 3 Hot Wheels coleccionables y 1 tarjeta a elección con dedicatoria especial.",
    price: 36000,
    image_url: "/img/ramohot.jpg",
    is_active: true,
    order_index: 3,
  },
  {
    id: "prod-4",
    category_id: "cat-1",
    title: "Ramo 4 - Edición Hot Wheels",
    description:
      "Incluye: 6 Hot Wheels surtidos y 1 tarjeta a elección con mensaje personalizado. El regalo soñado para coleccionistas.",
    price: 64000,
    image_url: "/img/ramohot.jpg",
    is_active: true,
    badge: "Mega Ramo",
    order_index: 4,
  },
  {
    id: "prod-5",
    category_id: "cat-1",
    title: "DulzuraBox con Hot Wheels Personalizada",
    description:
      "Los ramos o DulzuraBox con Hot Wheels también pueden ser personalizados: podés agregarle fotos, llaveros, juguetes, las golosinas o los snacks que quieras y mucho más. El precio varía dependiendo de lo que quieras agregarle.",
    price: 20000,
    price_label: "Desde $20.000",
    image_url: "/img/csja2.jpg",
    is_active: true,
    is_featured: true,
    badge: "Personalizable",
    order_index: 5,
  },

  // --- CATEGORÍA 2: CAJAS DULZURABOX ---
  {
    id: "prod-6",
    category_id: "cat-2",
    title: "DulzuraBox Básica",
    description:
      "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor simple, 1 chocolate Sapito, chupetines, chicles y caramelos.",
    price: 14000,
    image_url: "/img/caja1.jpg",
    is_active: true,
    order_index: 6,
  },
  {
    id: "prod-7",
    category_id: "cat-2",
    title: "DulzuraBox Clásica",
    description:
      "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor Milka, 1 Coca-Cola de 200ml, 1 chocolate Sapito, 1 chocolate Misky, chicles, chupetines y caramelos.",
    price: 18000,
    image_url: "/img/caja1.jpg",
    is_active: true,
    badge: "Clásico",
    order_index: 7,
  },
  {
    id: "prod-8",
    category_id: "cat-2",
    title: "DulzuraBox Premium",
    description:
      "Incluye: 2 tipos de malvaviscos, 2 tipos de gomitas ácidas, 1 alfajor Milka, 1 Coca-Cola de 200ml, 1 chocolate Sapito, 2 chocolates Misky, 1 chocolate Kinder, 1 barrita de Bon o Bon, 1 bocadito Kooky Bon de Fel Fort, chicles, chupetines y caramelos.",
    price: 22000,
    image_url: "/img/caja.jpg",
    is_active: true,
    is_featured: true,
    badge: "Recomendado",
    order_index: 8,
  },
  {
    id: "prod-9",
    category_id: "cat-2",
    title: "DulzuraBox Deluxe",
    description:
      "Incluye: 1 Chocolate Cofler, 2 chocolates Kinder, 2 alfajores a elección, 1 barrita Bon o Bon, 1 chocolate Sapito, 1 bocadito Kooky Bon de Fel Fort, 2 chocolates Misky, chicles, chupetines, caramelos y una bebida a elección.",
    price: 28000,
    image_url: "/img/caja.jpg",
    is_active: true,
    badge: "Deluxe",
    order_index: 9,
  },
  {
    id: "prod-10",
    category_id: "cat-2",
    title: "Dulzura Personalizada (Dulce o Picada)",
    description:
      "Las DulzuraBox también pueden ser personalizadas: podés agregarle fotos Polaroid, llaveros, maquillaje, juguetes, picada salada, bebidas, las golosinas o los snacks que quieras y mucho más. El precio varía según lo que elijas agregarle.",
    price: 18000,
    price_label: "A medida",
    image_url: "/img/catalogo/cat2.jpg",
    is_active: true,
    badge: "A Elección",
    order_index: 10,
  },

  // --- CATEGORÍA 3: RAMOS DULCES ---
  {
    id: "prod-11",
    category_id: "cat-3",
    title: "Ramo Base",
    description:
      "Incluye: 1 malvavisco, 2 tipos de gomitas ácidas, 1 chocolate Tita, 1 chocolate Hamlet, 1 Alfajor, 1 chocolate Sapito, 1 paquete de gomitas, chicles y caramelos.",
    price: 14000,
    image_url: "/img/ramo.jpg",
    is_active: true,
    order_index: 11,
  },
  {
    id: "prod-12",
    category_id: "cat-3",
    title: "Ramo DulzuraBox Amarillo",
    description:
      "Incluye: 1 chocolate Cofler, 1 chocolate Block, 1 barra Bon o Bon, 1 chocolate Tita y un Bon o Bon en presentación amarilla con dedicatoria.",
    price: 19000,
    image_url: "/img/catalogo/cat3.jpg",
    is_active: true,
    is_featured: true,
    badge: "Especial",
    order_index: 12,
  },
  {
    id: "prod-13",
    category_id: "cat-3",
    title: "Mega Ramo DulzuraBox",
    description:
      "Incluye todo el stock proporcionado a elección. Ramo gigante repleto de tus chocolates y golosinas favoritas. El precio varía dependiendo de los productos elegidos.",
    price: 30000,
    price_label: "Según elección",
    image_url: "/img/ramo.jpg",
    is_active: true,
    badge: "Gigante",
    order_index: 13,
  },
  {
    id: "prod-14",
    category_id: "cat-3",
    title: "Ramos Personalizados (Gomitas / Dulces)",
    description:
      "Los ramos también pueden ser 100% personalizados (como nuestro ramo floral de gomitas y malvaviscos con mariposas). El precio dependerá de lo que quieras incluir en el ramo.",
    price: 16000,
    price_label: "Personalizable",
    image_url: "/img/ramo.jpg",
    is_active: true,
    badge: "Viral",
    order_index: 14,
  },

  // --- CATEGORÍA 4: POLAROIDS ---
  {
    id: "prod-15",
    category_id: "cat-4",
    title: "Polaroids Individuales",
    description:
      "Incluye: 1 foto estilo Polaroid impresa en calidad fotográfica brillante (tamaño a elección). Ideal para sumar a tu caja o ramo.",
    price: 1000,
    image_url: "/img/catalogo/cat5.jpg",
    is_active: true,
    order_index: 15,
  },
  {
    id: "prod-16",
    category_id: "cat-4",
    title: "Pack 4 Polaroids (10 x 14,5 cm)",
    description:
      "Incluye: 4 fotos estilo Polaroid grandes de 10 x 14,5 cm con tus momentos favoritos.",
    price: 3000,
    image_url: "/img/catalogo/cat5.jpg",
    is_active: true,
    order_index: 16,
  },
  {
    id: "prod-17",
    category_id: "cat-4",
    title: "Pack 6 Polaroids (7 x 9 cm)",
    description:
      "Incluye: 6 fotos estilo Polaroid medianas de 7 x 9 cm listas para regalar o decorar.",
    price: 3500,
    image_url: "/img/catalogo/cat5.jpg",
    is_active: true,
    badge: "Más Pedido",
    order_index: 17,
  },
  {
    id: "prod-18",
    category_id: "cat-4",
    title: "Pack 20 Polaroids Mini (5 x 5 cm)",
    description:
      "Incluye: 20 mini fotos estilo Polaroid de 5 x 5 cm. Perfectas para llenar una caja sorpresa de recuerdos.",
    price: 5000,
    image_url: "/img/catalogo/cat5.jpg",
    is_active: true,
    badge: "Super Pack",
    order_index: 18,
  },

  // --- CATEGORÍA 5: CUADROS ---
  {
    id: "prod-19",
    category_id: "cat-5",
    title: "Cuadro Personalizado 15x21 cm",
    description:
      "Incluye: 1 portarretratos de 15 x 21 cm (6\"x8\") con una foto o collage impreso del diseño elegido por el cliente.",
    price: 14000,
    image_url: "/img/catalogo/5073449815580020053.jpg",
    is_active: true,
    order_index: 19,
  },
  {
    id: "prod-20",
    category_id: "cat-5",
    title: "Cuadro Personalizado Tamaño A4",
    description:
      "Incluye: 1 portarretratos de 21 x 29,7 cm (Tamaño A4) con una foto o diseño personalizado impreso en alta calidad.",
    price: 16000,
    image_url: "/img/catalogo/5073449815580020053.jpg",
    is_active: true,
    badge: "Tamaño A4",
    order_index: 20,
  },
];

export const CATALOG_SHEETS = [
  {
    id: "sheet-1",
    title: "Edición Hot Wheels",
    subtitle: "Ramos y Cajas Hot Wheels",
    image: "/img/catalogo/cat1.jpg",
  },
  {
    id: "sheet-2",
    title: "Edición DulzuraBox",
    subtitle: "Cajas Dulces y Personalizadas",
    image: "/img/catalogo/cat2.jpg",
  },
  {
    id: "sheet-3",
    title: "Edición Ramos",
    subtitle: "Ramos de Chocolates y Golosinas",
    image: "/img/catalogo/cat3.jpg",
  },
  {
    id: "sheet-4",
    title: "Edición Polaroids",
    subtitle: "Fotos Individuales y Packs por Tamaño",
    image: "/img/catalogo/cat5.jpg",
  },
  {
    id: "sheet-5",
    title: "Edición Cuadros",
    subtitle: "Cuadros 15x21 cm y Tamaño A4",
    image: "/img/catalogo/5073449815580020053.jpg",
  },
];
