"use client";

import Image from "next/image";
import Button from "../components/elements/Button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center min-h-screen px-4 py-10 text-center"
      style={{ backgroundColor: "var(--color-background)" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <Image
          src="/logo/asset-2.png"
          alt="Inferno Creative Logo"
          width={160}
          height={160}
          className="mb-6 w-32 md:w-40 h-auto"
        />
      </motion.div>

      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}>
        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-snug mb-4">
          Buat Undangan, Abadikan Momen, Dalam Satu Layanan
        </h1>
        <p className="text-base sm:text-md md:text-lg text-gray-700 mb-6">
          Layanan dokumentasi & undangan digital eksklusif untuk hari spesialmu.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}>
          <Button
            href="https://wa.me/081547473104"
            target="_blank"
            rel="noopener noreferrer">
            Pesan Sekarang
          </Button>
          <a
            href="#katalog"
            className="py-2 px-6 text-center text-white rounded text-sm sm:text-base"
            style={{ backgroundColor: "var(--color-accent)" }}>
            Lihat Detail
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
