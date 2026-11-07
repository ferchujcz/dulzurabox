import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#fff8fa",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dulzurabox.com.ar"),
  title: {
    default: "DulzuraBox | Regalos en Oberá, Regalos Personalizados y Ramos Hot Wheels",
    template: "%s | DulzuraBox Oberá",
  },
  description:
    "Boutique de regalos personalizados en Oberá, Misiones. Ramos de Hot Wheels, Cajas DulzuraBox, Ramos de Chocolates y Golosinas, Fotos Polaroid y Cuadros personalizados. ¡Pedí fácil por WhatsApp al +54 3755 583767!",
  keywords: [
    "regalos obera",
    "regalos en obera",
    "regalos personalizados",
    "regalos personalizados obera",
    "ramos hot wheels obera",
    "ramos de golosinas obera",
    "cajas de regalo obera",
    "dulzurabox",
    "dulzurabox obera",
    "regalos para novios obera",
    "fotos polaroid obera",
    "cuadros personalizados obera",
    "desayunos y regalos sorpresa obera misiones",
    "regalos dulces misiones",
  ],
  authors: [{ name: "DulzuraBox Oberá", url: "https://dulzurabox.com.ar" }],
  creator: "DulzuraBox",
  publisher: "DulzuraBox",
  alternates: {
    canonical: "https://dulzurabox.com.ar",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://dulzurabox.com.ar",
    siteName: "DulzuraBox | Regalos Personalizados en Oberá",
    title: "DulzuraBox ✨ Regalos en Oberá y Regalos Personalizados",
    description:
      "Regala detalles, no excusas. Ramos Hot Wheels, Cajas Dulces, Ramos de Golosinas, Polaroids y Cuadros en Oberá, Misiones. ¡Armá tu pedido por WhatsApp!",
    images: [
      {
        url: "/img/logo.jpg",
        width: 800,
        height: 800,
        alt: "DulzuraBox - Regala detalles, no excusas - Oberá Misiones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DulzuraBox | Regalos en Oberá y Regalos Personalizados",
    description:
      "Catálogo interactivo de ramos Hot Wheels, cajas dulces personalizadas, polaroids y cuadros en Oberá, Misiones.",
    images: ["/img/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "AR-N",
    "geo.placename": "Oberá, Misiones, Argentina",
    "geo.position": "-27.4871;-55.1199",
    ICBM: "-27.4871, -55.1199",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "Store", "GiftShop"],
      "@id": "https://dulzurabox.com.ar/#store",
      name: "DulzuraBox - Regalos Personalizados en Oberá",
      alternateName: "DulzuraBox Oberá",
      slogan: "Regala detalles, no excusas",
      description:
        "Tienda especializada en regalos personalizados en Oberá, Misiones: Ramos de Hot Wheels, Cajas DulzuraBox, Ramos de chocolates y gomitas, Impresión de Fotos Polaroid y Cuadros personalizados.",
      url: "https://dulzurabox.com.ar",
      telephone: "+543755583767",
      priceRange: "$$",
      currenciesAccepted: "ARS",
      paymentAccepted: "Efectivo, Transferencia Bancaria, Mercado Pago",
      image: [
        "https://dulzurabox.com.ar/img/logo.png",
        "https://dulzurabox.com.ar/img/ramohot.jpg",
        "https://dulzurabox.com.ar/img/caja.jpg",
        "https://dulzurabox.com.ar/img/ramo.jpg",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oberá",
        addressRegion: "Misiones",
        postalCode: "N3360",
        addressCountry: "AR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -27.4871,
        longitude: -55.1199,
      },
      areaServed: {
        "@type": "City",
        name: "Oberá",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Misiones",
        },
      },
      sameAs: ["https://www.instagram.com/dulzurabox"],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+54-3755-583767",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://dulzurabox.com.ar/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Dónde encargar regalos personalizados en Oberá?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En DulzuraBox creamos regalos personalizados en Oberá, Misiones. Podés elegir tu ramo Hot Wheels, caja dulce, ramo de golosinas, fotos Polaroid o cuadro desde nuestro catálogo online y finalizar tu compra directamente por WhatsApp al +54 3755 583767.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué incluyen los Ramos de Hot Wheels y las Cajas DulzuraBox?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nuestros Ramos de Hot Wheels incluyen de 1 a 6 autos originales más tarjeta dedicatoria personalizada. Las Cajas DulzuraBox vienen en versiones Básica, Clásica, Premium, Deluxe o 100% personalizadas con chocolates Kinder, Milka, Cofler, Bon o Bon, gomitas, bebidas, picadas o fotos Polaroid.",
          },
        },
        {
          "@type": "Question",
          name: "¿Con cuánta anticipación debo hacer mi pedido en Oberá?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Recomendamos reservar tu pedido con anticipación para personalizar cada detalle, imprimir tus fotos Polaroid o cuadros y preparar la tarjeta con el mensaje que desees. Consultanos disponibilidad inmediata por WhatsApp al 3755-583767.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#fff8fa] text-[#3d0c1a] antialiased selection:bg-[#7A0022] selection:text-white">
        {children}
      </body>
    </html>
  );
}
