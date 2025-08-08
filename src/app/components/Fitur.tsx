"use client";

import { FEATURES } from "../components/data/Feature";
import { motion } from "framer-motion";

export default function Fitur() {
  return (
    <section id="fitur" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Fitur Unggulan
          </h1>
          <p className="text-gray-600">
            Kami menyediakan berbagai fitur untuk memastikan undangan digital
            Anda sempurna.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-[var(--color-accent)] rounded-lg p-6 text-white shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
