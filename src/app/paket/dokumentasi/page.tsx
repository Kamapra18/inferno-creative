"use client";

import FooterSection from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import PaketSection from "../Paket";

export default function PaketDokumentasiAliasPage() {
  return (
    <div>
      <HeroSection variant="paketFotoVideo" />
      <PaketSection category="foto-video" />
      <FooterSection />
    </div>
  );
}
