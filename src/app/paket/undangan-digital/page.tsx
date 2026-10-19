"use client";

import FooterSection from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import PaketSection from "../Paket";

export default function PaketUndanganDigitalPage() {
  return (
    <div>
      <HeroSection variant="paketUndangan" />
      <PaketSection category="undangan-digital" />
      <FooterSection />
    </div>
  );
}
