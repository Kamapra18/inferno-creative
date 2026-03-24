"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section
      className="py-24 px-6 text-center"
      style={{ background: "var(--color-background-solid)" }}>
      <div className="max-w-4xl mx-auto">
        {/* HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6">
          Siap Abadikan Momen Terbaikmu?
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
          Dari undangan digital hingga dokumentasi acara, kami siap membantu
          membuat momen Anda lebih berkesan dan profesional.
        </motion.p>

        {/* BUTTON */}
        <motion.a
          href="https://wa.me/6285645150857"
          target="_blank"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-8 py-4 rounded-full bg-[var(--color-accent)] text-white font-semibold text-lg shadow-[0_0_30px_rgba(198,40,40,0.5)] hover:shadow-[0_0_40px_rgba(198,40,40,0.7)] transition">
          Konsultasi Sekarang
        </motion.a>

        {/* TRUST TEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-400 mt-6">
          Respon cepat • Konsultasi gratis • Tanpa ribet
        </motion.p>
      </div>
    </section>
  );
}
