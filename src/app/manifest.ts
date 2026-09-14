import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "字境 Glyphbound",
    short_name: "字境",
    description: "Mandarin reading RPG — fun first, learn by playing",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a252f",
    theme_color: "#1a252f",
    lang: "zh-CN",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
