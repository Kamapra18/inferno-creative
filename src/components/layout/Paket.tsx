"use client";

import ButtonCard from "../elements/ButtonCard";
import Button from "../elements/Button";
import {
  paketList,
  paketUndangan,
  paketDokumentasi,
  paketPhotobooth,
  paketAllInOne,
} from "@/data/Paket";
import { motion } from "framer-motion";

type Category = "all" | "undangan" | "dokumentasi" | "photobooth" | "home";

type Props = {
  category?: Category;
  limit?: number;
};

const Katalog = ({ category = "all", limit }: Props) => {
  const getData = () => {
    switch (category) {
      case "undangan":
        return paketUndangan;
      case "dokumentasi":
        return paketDokumentasi;
      case "photobooth":
        return paketPhotobooth;
      case "all":
        return paketList;
      case "home":
        return paketAllInOne;
      default:
        return paketList;
    }
  };

  const data = limit ? getData().slice(0, limit) : getData();

  return (
    <section
      id="paket"
      className="py-16"
      style={{ background: "var(--color-background-down)" }}>
      <div className="text-center mb-12 px-4">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--color-foreground)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}>
          Daftar Paket
        </motion.h1>

        <motion.p className="text-[var(--color-text-muted)]">
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
              {paket.badge && (
                <div className="absolute top-2 right-[-20px] rotate-12">
                  <span className="px-4 py-1 text-xs font-bold bg-[var(--color-accent)] text-white shadow-lg">
                    {paket.badge}
                  </span>
                </div>
              )}

              <h2 className="text-lg font-semibold mb-1 text-black">
                {paket.title}
              </h2>

              <h3 className="text-sm mb-2 text-black">{paket.subtitle}</h3>

              {paket.promo ? (
                <>
                  <p className="line-through text-[var(--color-accent)]">
                    {paket.originalPrice}
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {paket.price} <span className="text-sm">(promo)</span>
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-black">{paket.price}</p>
              )}

              <hr className="my-4" />

              <ul className="space-y-2 text-sm">
                {paket.features.map((fitur, i) => (
                  <li key={i} className="flex">
                    <span className="text-green-500 mr-2">✔</span>
                    <span className="text-black">{fitur}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <ButtonCard href="https://wa.me/6285645150857" target="_blank">
                {paket.buttonText}
              </ButtonCard>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button href="/paket">Lihat Paket Lengkapnya</Button>
      </div>
    </section>
  );
};

export default Katalog;
