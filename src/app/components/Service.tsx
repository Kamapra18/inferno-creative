"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <section id="services" className="py-16 bg-white px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-left mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Kenapa memilih layanan kami?
          </h1>
          <p className="text-gray-600">
            Kami hadir untuk memberikan layanan dokumentasi & undangan digital
            terbaik untuk hari spesialmu
          </p>
        </motion.div>

        {/* Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => {
            const items = [
              {
                title: "Foto & Video",
                desc: "Dokumentasikan setiap detail momen berharga dengan kualitas terbaik.",
              },
              {
                title: "Undangan Digital",
                desc: "Undangan digital interaktif dengan desain premium & fitur lengkap.",
              },
              {
                title: "Paket All in One",
                desc: "Solusi praktis: undangan + dokumentasi dalam satu layanan hemat & efisien.",
              },
            ];

            const { title, desc } = items[i];

            return (
              <motion.div
                key={i}
                className="text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-lime-700 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
