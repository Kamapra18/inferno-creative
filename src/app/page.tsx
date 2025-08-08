"use client";
import HeroSection from "./components/HeroSection";
import Services from "./components/Service";
import KatalogSection from "./components/Katalog";
import Fitur from "./components/Fitur";
import DaftarPaket from "./components/Paket";
import FAQ from "./components/FAQ";
import FooterSection from "./components/Footer";
import WhatsAppButton from "./components/Wa";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Services />
      <KatalogSection />
      <Fitur />
      <DaftarPaket />
      <FAQ />
      <WhatsAppButton />
      <FooterSection />
    </div>
  );
}
