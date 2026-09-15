import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZKR Resume AI",
    short_name: "ZKR Resume",
    description: "AI-Powered Resume Builder",
    start_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    icons: [
      { src: "/logo/zkr.jpg", sizes: "1170x1166", type: "image/jpeg" },
    ],
    theme_color: "#0a0a0c",
    background_color: "#0a0a0c",
  };
}