"use client";

import { motion } from "framer-motion";
import FooterLogo from "./footer/FooterLogo";
import FooterAddress from "./footer/FooterAddres";
import FooterContact from "./footer/FooterContact";
import FooterServices from "./footer/FooterServ";

export default function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8 px-6 sm:px-10"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <FooterLogo />
        <FooterAddress />
        <FooterServices />
        <FooterContact />
      </div>

      <div className="text-center text-black dark:text-white text-xs mt-11 px-4">
        <div className="h-px bg-black dark:bg-white opacity-30 mb-4"></div>
        <p className="mb-1">&copy; 2025. All rights reserved.</p>
        <p className="font-bold text-black dark:text-white">
          Inferno Creative.
        </p>
      </div>
    </motion.footer>
  );
}
