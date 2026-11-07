import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DulzuraBox | Regalos Personalizados en Oberá, Misiones",
    short_name: "DulzuraBox",
    description:
      "Catálogo interactivo de regalos personalizados en Oberá, Misiones: Ramos Hot Wheels, Cajas DulzuraBox, Ramos de Golosinas, Fotos Polaroid y Cuadros.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffb6c1",
    theme_color: "#900020",
    icons: [
      {
        src: "/img/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
