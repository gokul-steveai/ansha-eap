import PageTransition from "@/components/ui/pageTransition";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// const font = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-sans",
// });

const font = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ELEVATE",
  description: "By ANSA",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elevate",
  },
};
export const viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        
          <TooltipProvider>
            <Toaster position="top-right" />
            <PageTransition>{children}</PageTransition>
          </TooltipProvider>
        
      </body>
    </html>
  );
}
