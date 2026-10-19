"use client";

import FooterSection from "@/components/layout/Footer";
import HeroSection from "@/components/layout/HeroSection";
import PaketSection from "../Paket";

export default function PaketPhotoboothPage() {
  return (
    <div>
      <HeroSection variant="paketPhotobooth" />
      <PaketSection category="photobooth" />
      <FooterSection />
    </div>
  );
}
