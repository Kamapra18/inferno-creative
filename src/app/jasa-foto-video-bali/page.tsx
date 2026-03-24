"use client";
import HeroSection from "@/components/layout/HeroSection";
import Services from "@/components/layout/Service";
import KatalogSection from "@/components/layout/Katalog";
import Fitur from "@/components/layout/Fitur";
import DaftarPaket from "@/components/layout/Paket";
import FAQ from "@/components/layout/FAQ";
import FooterSection from "@/components/layout/Footer";
import WhatsAppButton from "@/components/feature/Wa";
import CTASection from "@/components/feature/CTA";
import { serviceDokumentasi } from "@/data/Service";
import { fiturDokumentasi } from "@/data/Feature";

export default function JasaFotoVideo() {
  return (
    <div>
      <HeroSection variant="fotoVideo" />
      <Services
        title="Layanan Kami"
        desc="Kami hadir untuk memberikan layanan dokumentasi & undangan digital terbaik untuk hari spesialmu"
        data={serviceDokumentasi}
      />
      <KatalogSection defaultCategory="fotoVideo" showCategory={false} />
      <Fitur title="Fitur Unggulan" data={fiturDokumentasi} />
      <DaftarPaket category="dokumentasi" />
      <FAQ defaultCategory="dokumentasi" showCategory={false} />
      <CTASection />
      <WhatsAppButton />
      <FooterSection />
    </div>
  );
}
