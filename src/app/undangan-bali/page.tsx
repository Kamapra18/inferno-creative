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
import { serviceUndangan } from "@/data/Service";
import { fiturUndangan } from "@/data/Feature";

export default function Undangan() {
  return (
    <div>
      <HeroSection variant="undangan" />
      <Services
        title="Layanan Kami"
        desc="Kami hadir untuk memberikan layanan dokumentasi & undangan digital terbaik untuk hari spesialmu"
        data={serviceUndangan}
      />
      <KatalogSection defaultCategory="undangan" showCategory={false} />
      <Fitur title="Fitur Unggulan" data={fiturUndangan} />
      <DaftarPaket category="undangan" />
      <FAQ defaultCategory="undangan" showCategory={false} />
      <CTASection />
      <WhatsAppButton />
      <FooterSection />
    </div>
  );
}
