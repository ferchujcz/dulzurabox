import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dulzurabox.com"),
  title: "DulzuraBox | Regala detalles, no excusas",
  description: "Catálogo interactivo de regalos dulces, ramos Hot Wheels, cajas personalizadas, chocolates y detalles únicos.",
  keywords: ["DulzuraBox", "Regalos dulces", "Hot Wheels", "Chocolates", "Ramos dulces", "Cajas de regalo"],
  openGraph: {
    title: "DulzuraBox | Regala detalles, no excusas",
    description: "Catálogo interactivo de ramos Hot Wheels y cajas dulces personalizadas.",
    images: ["/img/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#ffb6c1] text-[#900020] antialiased selection:bg-[#900020] selection:text-white">
        {children}
      </body>
    </html>
  );
}
