"use client";

import { useState } from "react";
import Image from "next/image";
import {
  katalogAll,
  katalogFotoVideo,
  katalogPhotobooth,
  katalogUndangan,
} from "@/data/Katalog";
import { motion } from "framer-motion";
import Back from "@/components/elements/Back";

type Category = "all" | "fotoVideo" | "photobooth" | "undangan";

const categories = [
  { label: "Semua", value: "all" },
  { label: "Foto & Video", value: "fotoVideo" },
  { label: "Photobooth", value: "photobooth" },
  { label: "Undangan", value: "undangan" },
];

export default function ProjectsSection() {
  const [active, setActive] = useState<Category>("all");

  const getData = () => {
    switch (active) {
      case "fotoVideo":
        return katalogFotoVideo;
      case "photobooth":
        return katalogPhotobooth;
      case "undangan":
        return katalogUndangan;
      default:
        return katalogAll;
    }
  };

  const data = getData();

  return (
    <section
      id="porto"
      className="py-20 px-4"
      style={{ background: "var(--color-background-solid)" }}>
      <div className="max-w-6xl mx-auto text-center">
        {/* HEADING */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Portofolio Kami
          </h1>

          <p className="text-white max-w-2xl mx-auto">
            Lihat berbagai hasil karya terbaik kami dari wedding, event,
            photobooth hingga undangan digital dengan kualitas profesional.
          </p>
        </div>

        {/* FILTER */}
        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value as Category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-sm
              ${
                active === cat.value
                  ? "bg-white text-black border-white shadow-lg scale-105"
                  : "border-white/30 text-white hover:border-white hover:bg-white/10 hover:scale-105"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-xl cursor-pointer">
              {/* IMAGE */}
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={600}
                className="w-full aspect-[4/5] object-cover transition duration-500 group-hover:scale-110"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition duration-300" />

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-left">
                <h3 className="text-white font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-300 capitalize mb-3">
                  {item.category} • {item.type}
                </p>

                {item.category === "undangan" ? (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    className="inline-block text-xs px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-full hover:scale-105 transition">
                    Lihat Demo
                  </a>
                ) : (
                  <a
                    href="https://wa.me/6285645150857"
                    target="_blank"
                    className="inline-block text-xs px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-full hover:scale-105 transition">
                    Booking Sekarang
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
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
}
