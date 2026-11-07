import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "Google-Extended", "PerplexityBot", "ClaudeBot"],
        allow: "/",
        disallow: ["/admin"],
      },
    ],
    sitemap: "https://dulzurabox.com.ar/sitemap.xml",
    host: "https://dulzurabox.com.ar",
  };
}
