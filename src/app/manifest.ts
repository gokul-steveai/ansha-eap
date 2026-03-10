import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elevate by ANSA",
    short_name: "Elevate",
    start_url: "/",
    scope: "/",
    display: "standalone",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    screenshots: [
      {
        src: "/screenshots/homepage-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "/screenshots/homepage-mobile.png",
        sizes: "480x800",
        type: "image/png"
      }
    ]
  }
}
