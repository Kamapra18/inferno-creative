"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "../elements/Button";
import {
  katalogAll,
  katalogFotoVideo,
  katalogPhotobooth,
  katalogUndangan,
} from "@/data/Katalog";
import { motion } from "framer-motion";

type Category = "all" | "fotoVideo" | "photobooth" | "undangan";

type Props = {
  defaultCategory?: Category;
  showCategory?: boolean;
};

const categories = [
  { label: "Semua", value: "all" },
  { label: "Foto & Video", value: "fotoVideo" },
  { label: "Photobooth", value: "photobooth" },
  { label: "Undangan", value: "undangan" },
];

export default function KatalogSection({
  defaultCategory = "all",
  showCategory = true,
}: Props) {
  const [active, setActive] = useState<Category>(defaultCategory);

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

  const data = getData().slice(0, 6);

  return (
    <section
      id="katalog"
      className="py-20 px-4"
      style={{ background: "var(--color-background-down)" }}>
      <div className="max-w-6xl mx-auto text-center">
        {/* HEADING */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Portofolio
          </h2>
          <p className="text-white max-w-2xl mx-auto">
            Beberapa hasil dokumentasi terbaik dari berbagai acara
          </p>
        </div>

        {/* CATEGORY (OPTIONAL) */}
        {showCategory && (
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
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={600}
                className="w-full aspect-[4/5] object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/40" />

              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-left">
                <h3 className="font-semibold text-lg text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-300 capitalize mb-3">
                  {item.category} • {item.type}
                </p>

                {/* CTA KHUSUS UNDANGAN */}
                {item.category === "undangan" && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    className="inline-block text-xs px-3 py-1.5 bg-[var(--color-accent)] text-white rounded-full mt-2 hover:scale-105 transition">
                    Lihat Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button href="/projects">Lihat Semua Portofolio</Button>
        </div>
      </div>
    </section>
  );
}
