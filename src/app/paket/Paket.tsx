"use client";

import ButtonCard from "@/components/elements/ButtonCard";
import Back from "@/components/elements/Back";
import { paketList } from "@/data/Paket";
import { motion } from "framer-motion";

const Katalog = () => {
  const data = paketList;

  return (
    <section
      id="paket"
      className="py-16"
      style={{ background: "var(--color-background-solid)" }}>
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
          transition={{ delay: 0.2 }}>
          Pilih paket sesuai kebutuhan Anda.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {data.map((paket, index) => (
          <motion.div
            key={index}
            className="relative rounded-xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition cursor-zoom-in"
            style={{ background: "var(--color-card)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <div>
              {/* Badge Promo/Populer jika ada */}
              {paket.badge && (
                <div className="absolute top-2 right-[-10px] rotate-12 z-10">
                  <span className="px-4 py-1 text-xs font-bold bg-[var(--color-accent)] text-white shadow-lg">
                    {paket.badge}
                  </span>
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1 text-black">
                {paket.title}
              </h2>

              <h3 className="text-sm mb-2 text-black opacity-80">
                {paket.subtitle}
              </h3>

              {paket.promo ? (
                <>
                  <p className="line-through text-[var(--color-accent)] text-sm">
                    {paket.originalPrice}
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {paket.price}{" "}
                    <span className="text-sm font-normal">(promo)</span>
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-black">{paket.price}</p>
              )}

              <hr className="my-4 border-gray-300" />

              <ul className="space-y-2 text-sm">
                {paket.features.map((fitur, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span>
                    <span className="text-black">{fitur}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <ButtonCard href={`/booking?service=${encodeURIComponent(paket.title)}`}>
                {paket.buttonText}
              </ButtonCard>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
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
