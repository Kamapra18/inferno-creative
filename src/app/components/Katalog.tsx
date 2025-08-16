"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./elements/Button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { katalogWeb, katalogFoto } from "../components/data/Katalog";
import { motion } from "framer-motion";

export default function KatalogSection() {
  const [activeTab, setActiveTab] = useState<"web" | "foto">("web");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const data = activeTab === "web" ? katalogWeb : katalogFoto;

  return (
    <section
      id="katalog"
      className="py-16"
      style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h1
            className="font-bold text-4xl md:text-5xl mb-4"
            style={{ color: "var(--color-foreground)" }}>
            Katalog Website Undangan
          </h1>
          <p className="text-gray-700">
            Tampilan elegan, fitur lengkap, dan desain yang bisa disesuaikan
            sesuai keinginan.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}>
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

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}>
          <Slider {...settings}>
            {data.map((src, idx) => (
              <div key={idx} className="px-3">
                <Image
                  src={src}
                  alt="Katalog"
                  width={300}
                  height={500}
                  className="rounded shadow-md mx-auto"
                />
              </div>
            ))}
          </Slider>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}>
          <Button href="/projects">Lihat Semuanya</Button>
        </motion.div>
      </div>
    </section>
  );
}
