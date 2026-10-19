"use client";

import Link from "next/link";
import {
  Eye,
  Camera,
  Printer,
  Mail,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import ButtonCard from "@/components/elements/ButtonCard";
import Back from "@/components/elements/Back";
import {
  paketUtama,
  paketDokumentasi,
  paketPhotobooth,
  paketUndangan,
} from "@/data/Paket";
import { motion } from "framer-motion";

export type PaketCategory = "all" | "foto-video" | "photobooth" | "undangan-digital";

interface Props {
  category?: PaketCategory;
}

const categories = [
  {
    id: "all" as PaketCategory,
    label: "Paket Unggulan",
    href: "/paket",
    icon: Sparkles,
  },
  {
    id: "foto-video" as PaketCategory,
    label: "Foto & Video",
    href: "/paket/foto-video",
    icon: Camera,
  },
  {
    id: "photobooth" as PaketCategory,
    label: "Photobooth",
    href: "/paket/photobooth",
    icon: Printer,
  },
  {
    id: "undangan-digital" as PaketCategory,
    label: "Undangan Digital",
    href: "/paket/undangan-digital",
    icon: Mail,
  },
];

const getPortoHref = (category: string) => {
  switch (category) {
    case "photobooth":
      return "/projects?category=photobooth#porto";
    case "undangan":
      return "/projects?category=undangan#porto";
    case "dokumentasi":
    case "foto-video":
      return "/projects?category=fotoVideo#porto";
    case "all":
    default:
      return "/projects?category=all#porto";
  }
};

const PaketSection = ({ category = "all" }: Props) => {
  const getCategoryMeta = () => {
    switch (category) {
      case "foto-video":
        return {
          title: "Paket Dokumentasi Foto & Video",
          subtitle:
            "Abadikan setiap momen spesial dengan dokumentasi cinematic & profesional untuk prewedding, wedding, wisuda, dan event.",
          data: paketDokumentasi,
          badge: "Kategori Foto & Video",
        };
      case "photobooth":
        return {
          title: "Paket Sewa Photobooth Bali",
          subtitle:
            "Photobooth interaktif dengan cetak instan kualitas studio, custom template frame, dan akses softcopy digital untuk semua jenis event.",
          data: paketPhotobooth,
          badge: "Kategori Photobooth",
        };
      case "undangan-digital":
        return {
          title: "Paket Undangan Digital",
          subtitle:
            "Website undangan pernikahan & event modern dengan fitur RSVP, amplop digital, musik, Google Maps, dan tema eksklusif.",
          data: paketUndangan,
          badge: "Kategori Undangan Digital",
        };
      case "all":
      default:
        return {
          title: "Paket Unggulan Kami",
          subtitle:
            "Berikut paket unggulan yang ada di menu utama. Pilih kategori di atas untuk melihat pilihan paket lainnya.",
          data: paketUtama,
          badge: "Paket Unggulan Menu Utama",
        };
    }
  };

  const { title, subtitle, data, badge } = getCategoryMeta();

  return (
    <section
      id="paket"
      className="py-16 px-4 sm:px-6"
      style={{ background: "var(--color-background-solid)" }}>
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="text-center mb-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span>{badge}</span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "var(--color-foreground)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            {title}
          </motion.h1>

          <motion.p
            className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            {subtitle}
          </motion.p>
        </div>

        {/* CATEGORY TABS / FILTER */}
        <div className="flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;

            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white border-red-500/60 shadow-lg shadow-red-950/60 scale-105"
                    : "bg-white/5 border-white/15 text-white/80 hover:text-white hover:bg-white/15 hover:border-white/30 hover:scale-102"
                }`}>
                <Icon
                  size={16}
                  className={isActive ? "text-white" : "text-white/70 group-hover:text-white"}
                />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* PACKAGE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

                <h3 className="text-sm mb-3 text-white/70">{paket.subtitle}</h3>

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
                  <Eye
                    size={14}
                    className="group-hover/porto:scale-110 transition-transform text-white/80 group-hover/porto:text-white"
                  />
                  <span>Lihat Portofolio</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM HELP & BACK BUTTON */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-semibold text-white">Butuh konsultasi paket custom?</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Tim Inferno Creative siap membantu menyesuaikan paket sesuai konsep dan budget acara Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6285645150857?text=Halo%20Inferno%20Creative,%20saya%20ingin%20konsultasi%20paket%20layanan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950/60 transition-all duration-200">
              <MessageCircle size={15} />
              <span>Chat WhatsApp</span>
            </a>

            {category !== "all" ? (
              <Back href="/paket">Kembali ke Paket Unggulan</Back>
            ) : (
              <Back href="/">Kembali ke Beranda</Back>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaketSection;
