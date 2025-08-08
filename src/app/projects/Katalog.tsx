"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/elements/Button";
import Image from "next/image";
import Back from "../components/elements/Back";
import { katalogWeb, katalogFoto } from "./data/Data";

interface KatalogItem {
  image: string;
  linkDemo: string;
  linkWa: string;
}

export default function KatalogSection() {
  const [activeTab, setActiveTab] = useState<"web" | "foto">("web");

  const data: KatalogItem[] =
    activeTab === "web"
      ? katalogWeb
      : katalogFoto.map((img: string) => ({
          image: img,
          linkDemo: "#",
          linkWa: "#",
        }));

  return (
    <motion.section
      id="katalog"
      className="py-16"
      style={{ backgroundColor: "var(--color-white)" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}>
          <h1 className="font-bold text-4xl md:text-5xl mb-4">
            Katalog Website Undangan
          </h1>
          <p className="text-gray-700">
            Tampilan elegan, fitur lengkap, dan desain yang bisa disesuaikan
            sesuai keinginan.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}>
          <button
            onClick={() => setActiveTab("web")}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 border ${
              activeTab === "web"
                ? "bg-[var(--color-accent)] text-white"
                : "border-[var(--color-accent)] text-[var(--color-accent)]"
            }`}>
            Web Undangan
          </button>
          <button
            onClick={() => setActiveTab("foto")}
            className={`px-6 py-2 rounded-full font-medium transition-colors duration-300 border ${
              activeTab === "foto"
                ? "bg-[var(--color-accent)] text-white"
                : "border-[var(--color-accent)] text-[var(--color-accent)]"
            }`}>
            Foto
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}>
              <Image
                src={item.image}
                alt={`Katalog ${idx + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />

              {activeTab === "web" && (
                <div className="p-4 text-center flex justify-center gap-3">
                  <a
                    href={item.linkWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded bg-[var(--color-accent)] text-white font-semibold transition hover:opacity-90">
                    Pesan
                  </a>
                  <Button
                    href={item.linkDemo}
                    target="_blank"
                    rel="noopener noreferrer">
                    Lihat
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}>
          <Back href="/">Kembali</Back>
        </motion.div>
      </div>
    </motion.section>
  );
}
