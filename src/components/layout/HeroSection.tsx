"use client";

import Image from "next/image";
import Button from "../elements/Button";
import { motion } from "framer-motion";
import { heroData } from "@/data/Hero";

type HeroProps = {
  variant?:
    | "home"
    | "fotoVideo"
    | "photobooth"
    | "undangan"
    | "paket"
    | "porto";
};

export default function HeroSection({ variant = "home" }: HeroProps) {
  const data = heroData[variant];

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center"
      style={{ background: "var(--color-background)" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <Image
          src="/logo/Asset-2.png"
          alt="Inferno Creative Logo"
          width={160}
          height={160}
          priority
          className="mb-6 w-32 md:w-40 h-auto"
        />
      </motion.div>

      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}>
        <h1
          className="font-bold text-3xl sm:text-4xl md:text-5xl leading-snug mb-4"
          style={{ color: "var(--color-foreground)" }}>
          {data.title}
        </h1>

        <p className="text-base sm:text-md md:text-lg text-[var(--color-text-muted)] mb-6">
          {data.desc}
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}>
          <Button
            href={data.primaryCTA.href}>
            {data.primaryCTA.label}
          </Button>

          <a
            href={data.secondaryCTA.href}
            className="py-2 px-6 text-center text-white rounded text-sm sm:text-base"
            style={{ backgroundColor: "var(--color-accent)" }}>
            {data.secondaryCTA.label}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
