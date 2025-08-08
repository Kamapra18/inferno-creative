"use client";

import Order from "../components/elements/Order";
import Back from "../components/elements/Back";
import { paketList } from "./data/Data";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      stiffness: 100,
      damping: 15,
    },
  },
};

const Katalog = () => {
  return (
    <section id="katalog" className="py-16 bg-white">
      <div className="text-center mb-12">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          Daftar Paket
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          Pilih paket undangan & dokumentasi sesuai kebutuhan Anda.
        </motion.p>
      </div>

      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {paketList.map((paket, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="rounded-xl p-6 shadow-md flex flex-col justify-between"
            style={{ backgroundColor: "var(--color-background)" }}>
            <div>
              <h2 className="text-xl font-semibold mb-1">{paket.title}</h2>
              <h3 className="text-sm text-gray-500 mb-2">{paket.subtitle}</h3>

              {paket.promo ? (
                <div className="mb-2">
                  <p className="text-gray-500 line-through">
                    {paket.originalPrice}
                  </p>
                  <p className="text-2xl font-bold text-primary">
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
      </motion.div>

      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <Back href="/" onClick={() => window.history.back()}>
          Kembali
        </Back>
      </motion.div>
    </section>
  );
};

export default Katalog;
