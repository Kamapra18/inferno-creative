"use client";

import ButtonCard from "./elements/ButtonCard";
import Button from "./elements/Button";
import { paketList } from "../components/data/Paket";
import { motion } from "framer-motion";

const Katalog = () => {
  return (
    <section
      id="katalog"
      className="py-16 "
      style={{ background: "var(--color-background-down)" }}>
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
          className="text-[var(--color-text-muted)]"
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
            className="rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition"
            style={{ background: "var(--color-card)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}>
            <div>
              <h2
                className="text-lg md:text-xl font-semibold mb-1"
                style={{ color: "var(--color-background-solid)" }}>
                {paket.title}
              </h2>
              <h3 className="text-sm text-black mb-2">{paket.subtitle}</h3>

              {paket.promo ? (
                <div className="mb-2">
                  <p className="text-[var(--color-accent)] line-through">
                    {paket.originalPrice}
                  </p>
                  <p className="text-2xl font-bold text-primary text-black">
                    {paket.price}{" "}
                    <span className="text-sm font-normal text-black">
                      (promo)
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-2xl  font-bold text-primary text-black">
                  {paket.price}
                </p>
              )}

              <hr className="my-4" />

              <ul className="space-y-2 text-sm text-black">
                {paket.features.map((fitur, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    <span className="text-black">{fitur}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <ButtonCard
                href="https://wa.me/6281547473104"
                target="_blank"
                rel="noopener noreferrer">
                {paket.buttonText}
              </ButtonCard>
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
        <Button href="/paket" style={{ color: "var(--color-foreground)" }}>
          Lihat Paket Lengkapnya
        </Button>
      </motion.div>
    </section>
  );
};

export default Katalog;
