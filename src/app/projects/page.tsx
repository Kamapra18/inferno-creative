"use client";

import HeroSection from "@/components/layout/HeroSection";
import KatalogSection from "./Katalog";
import FooterSection from "@/components/layout/Footer";

export default function Project() {
  return (
    <div>
      <HeroSection variant="porto" />
      <KatalogSection />
      <FooterSection />
    </div>
  );
}
