import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Font utama
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inferno Creative",
  description:
    "Inferno Creative adalah penyedia jasa fotografi, videografi, dan pembuatan website undangan digital dengan sentuhan profesional dan estetika modern.",
  icons: {
    icon: "/logo/Asset-4.png",
  },
  keywords: [
    "Inferno Creative",
    "jasa fotografi Bali",
    "jasa videografi Bali",
    "jasa fotografi profesional",
    "jasa videografi profesional",
    "jasa fotografi modern",
    "jasa videografi modern",
    "jasa fotografi Bali modern",
    "jasa videografi Bali modern",
    "jasa fotografi Bali profesional",
    "jasa videografi Bali profesional",
    "jasa prewedding Bali",
    "jasa wedding Bali",
    "jasa foto prewedding",
    "jasa foto wedding",
    "jasa foto produk",
    "jasa foto makanan",
    "jasa foto event",
    "jasa foto komersial",
    "jasa foto fashion",
    "jasa foto keluarga",
    "jasa dokumentasi acara",
    "jasa fotografi",
    "jasa videografi",
    "web undangan digital",
    "website undangan ulang tahun digital",
    "website undangan pernikahan digital",
    "website undangan digital metatah",
    "website undangan digital mepandes",
    "website undangan digital 3 bulanan",
    "undangan online",
    "jasa dokumentasi acara",
    "foto pernikahan",
    "video pernikahan",
    "undangan digital Bali",
  ],
  robots: "index, follow",
  authors: [{ name: "Inferno Creative", url: "https://infernocreative.com" }],
  creator: "Inferno Creative",
  publisher: "Inferno Creative",
  themeColor: "#1c2a58",
  metadataBase: new URL("https://infernocreative.com"),
  openGraph: {
    title: "Inferno Creative",
    description:
      "Penyedia jasa fotografi, videografi, dan web undangan digital profesional dan kreatif.",
    url: "https://infernocreative.com",
    siteName: "Inferno Creative",
    images: [
      {
        url: "/logo/Asset-2.png",
        width: 1200,
        height: 630,
        alt: "Inferno Creative - Jasa Foto Video & Web Undangan",
      },
    ],
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inferno Creative",
    description:
      "Jasa fotografi, videografi, dan website undangan digital modern.",
    images: ["/og-image.jpg"],
    creator: "@infernocreative",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`
          ${inter.variable} 
          ${playfair.variable} 
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased
        `}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
