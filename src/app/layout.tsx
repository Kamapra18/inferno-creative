import type { Metadata } from "next";
import {
  Geist,
  Inter,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Montserrat,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ConsoleLog from "@/components/feature/ConsoleLog";

// Font utama
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.inferno-production.com/"),

  title: {
    default: "Inferno Creative - Jasa Foto Video & Undangan Digital Bali",
    template: "%s | Inferno Creative",
  },

  description:
    "Jasa fotografi, videografi, photobooth, dan pembuatan website undangan digital di Bali. Profesional, cinematic, dan modern untuk wedding, event, dan bisnis.",

  keywords: [
    "jasa foto Bali",
    "jasa video Bali",
    "jasa wedding Bali",
    "photobooth Bali",
    "undangan digital Bali",
    "jasa dokumentasi Bali",
    "Dokumentasi Murah di Bali",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  authors: [
    { name: "Inferno Creative", url: "https://www.inferno-production.com/" },
  ],

  openGraph: {
    title: "Inferno Creative - Jasa Foto Video & Undangan Digital Bali",
    description:
      "Layanan profesional fotografi, videografi, photobooth, dan undangan digital di Bali.",
    url: "https://www.inferno-production.com/",
    siteName: "Inferno Creative",
    images: [
      {
        url: "/logo/Asset-2.png",
        width: 1200,
        height: 630,
        alt: "Inferno Creative",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Inferno Creative",
    description: "Jasa foto, video, photobooth & undangan digital Bali.",
    images: ["/logo/Asset-2.png"],
  },

  icons: {
    icon: "/logo/Asset-4.png",
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
          ${jakarta.variable} 
          ${inter.variable}
          ${playfair.variable} 
          ${geistSans.variable} 
          ${montserrat.variable} 
          antialiased
        `}>
        <ConsoleLog />
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Inferno Creative",
              image: "https://www.inferno-production.com/logo/Asset-4.png",
              url: "https://www.inferno-production.com/",
              telephone: "+6285645150857",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bali",
                addressCountry: "ID",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-8.4095",
                longitude: "115.1889",
              },
              areaServed: "Bali",
              sameAs: ["https://www.instagram.com/inferno.creativee/"],
              priceRange: "$$",
              description:
                "Jasa fotografi, videografi, photobooth, dan undangan digital profesional di Bali.",
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Jasa Fotografi & Videografi",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Photobooth",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Undangan Digital",
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
