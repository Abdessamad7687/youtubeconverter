import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "toTube — Convertisseur YouTube MP3 & MP4",
    short_name: "toTube",
    description: "Convertisseur YouTube MP3 et MP4 gratuit, rapide et sans inscription.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5ed",
    theme_color: "#171b1a",
    lang: "fr-FR",
    icons: [
      {
        src: "/totube-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/totube-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
