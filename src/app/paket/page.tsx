"use client";

import FooterSection from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import PaketSection from "./Paket";

export default function Paket() {
  return (
    <div>
      <HeroSection variant="paket" />
      <PaketSection />
      <FooterSection />
    </div>
  );
}
