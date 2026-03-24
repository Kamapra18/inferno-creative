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
import { servicePhotobooth } from "@/data/Service";
import { fiturPhotobooth } from "@/data/Feature";

export default function Photobooth() {
  return (
    <div>
      <HeroSection variant="photobooth" />
      <Services
        title="Layanan Kami"
        desc="Kami hadir untuk memberikan layanan dokumentasi & undangan digital terbaik untuk hari spesialmu"
        data={servicePhotobooth}
      />
      <KatalogSection defaultCategory="photobooth" showCategory={false} />
      <Fitur title="Fitur Unggulan" data={fiturPhotobooth} />
      <DaftarPaket category="photobooth" />
      <FAQ defaultCategory="photobooth" showCategory={false} />
      <CTASection />
      <WhatsAppButton />
      <FooterSection />
    </div>
  );
}
