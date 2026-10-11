"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import ButtonCard from "@/components/elements/ButtonCard";
import Back from "@/components/elements/Back";
import { paketList } from "@/data/Paket";
import { motion } from "framer-motion";

const getPortoHref = (category: string) => {
  switch (category) {
    case "photobooth":
      return "/projects?category=photobooth#porto";
    case "undangan":
      return "/projects?category=undangan#porto";
    case "dokumentasi":
      return "/projects?category=fotoVideo#porto";
    case "all":
    default:
      return "/projects?category=all#porto";
  }
};

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
            className="relative rounded-3xl p-6 md:p-7 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col justify-between hover:bg-white/[0.14] hover:border-white/35 transition-all duration-300 cursor-default group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <div>
              {/* Badge Promo/Populer jika ada */}
              {paket.badge && (
                <div className="absolute top-3 right-[-6px] rotate-12 z-10">
                  <span className="px-3.5 py-1 text-xs font-bold bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-950/60 rounded-md border border-red-400/40">
                    {paket.badge}
                  </span>
                </div>
              )}

              <h2 className="text-xl md:text-2xl font-bold mb-1.5 text-white tracking-tight">
                {paket.title}
              </h2>

              <h3 className="text-sm mb-3 text-white/70">
                {paket.subtitle}
              </h3>

              {paket.promo ? (
                <div>
                  <p className="line-through text-red-300/80 text-xs font-medium">
                    {paket.originalPrice}
                  </p>
                  <p className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                    {paket.price}{" "}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/30 text-red-200 border border-red-500/30">
                      promo
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-extrabold text-white">{paket.price}</p>
              )}

              <hr className="my-5 border-white/15" />

              <ul className="space-y-2.5 text-sm">
                {paket.features.map((fitur, i) => (
                  <li key={i} className="flex items-start text-white/85">
                    <span className="text-emerald-400 mr-2.5 font-bold shrink-0">✔</span>
                    <span>{fitur}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2.5">
              <ButtonCard href={`/booking?service=${encodeURIComponent(paket.title)}`}>
                {paket.buttonText}
              </ButtonCard>
              <a
                href={getPortoHref(paket.category)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-white/20 text-white bg-white/10 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-200 shadow-md group/porto shrink-0 cursor-pointer"
                title="Lihat Portofolio">
                <Eye size={14} className="group-hover/porto:scale-110 transition-transform text-white/80 group-hover/porto:text-white" />
                <span>Lihat Portofolio</span>
              </a>
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
