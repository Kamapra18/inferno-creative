"use client";

import Order from "./elements/Order";
import Button from "./elements/Button";
import { paketList } from "../components/data/Paket";
import { motion } from "framer-motion";

const Katalog = () => {
  return (
    <section id="katalog" className="py-16 bg-neutral-50">
      <div className="text-center mb-12 px-4">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--color-foreground)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Daftar Paket
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}>
          Pilih paket undangan & dokumentasi sesuai kebutuhan Anda.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {paketList.map((paket, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <div>
              <h2
                className="text-lg md:text-xl font-semibold mb-1"
                style={{ color: "var(--color-foreground)" }}>
                {paket.title}
              </h2>
              <h3 className="text-sm text-gray-500 mb-2">{paket.subtitle}</h3>

              {paket.promo ? (
                <div className="mb-2">
                  <p className="text-gray-500 line-through">
                    {paket.originalPrice}
                  </p>
                  <p
                    className="text-2xl font-bold text-primary"
                    style={{ color: "var(--color-foreground)" }}>
                    {paket.price}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      (promo)
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-primary">{paket.price}</p>
              )}

              <hr className="my-4" />

              <ul className="space-y-2 text-sm text-gray-700">
                {paket.features.map((fitur, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    <span>{fitur}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Order
                href="https://wa.me/081547473104"
                target="_blank"
                rel="noopener noreferrer">
                {paket.buttonText}
              </Order>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}>
        <Button href="/paket">Lihat Paket Lengkapnya</Button>
      </motion.div>
    </section>
  );
};

export default Katalog;
