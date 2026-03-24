"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  faqUmum,
  faqUndangan,
  faqDokumentasi,
  faqPhotobooth,
} from "../../data/FAQ";

type Category = "umum" | "undangan" | "dokumentasi" | "photobooth";

type FAQProps = {
  defaultCategory?: Category;
  showCategory?: boolean;
};

const categories: { label: string; value: Category }[] = [
  { label: "Umum", value: "umum" },
  { label: "Undangan", value: "undangan" },
  { label: "Dokumentasi", value: "dokumentasi" },
  { label: "Photobooth", value: "photobooth" },
];

const FAQ = ({ defaultCategory = "umum", showCategory = true }: FAQProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(defaultCategory);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getFaq = () => {
    switch (selectedCategory) {
      case "umum":
        return faqUmum;
      case "undangan":
        return faqUndangan;
      case "dokumentasi":
        return faqDokumentasi;
      case "photobooth":
        return faqPhotobooth;
      default:
        return faqUmum;
    }
  };

  const faqs = getFaq();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 px-6"
      style={{ background: "var(--color-background)" }}>
      {/* HEADER */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">FAQ</h1>

        <p className="text-[var(--color-text-muted)]">
          Punya pertanyaan? Kami sudah siapkan jawabannya untuk Anda.
        </p>
      </motion.div>

      {/* CATEGORY (OPTIONAL) */}
      {showCategory && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setOpenIndex(null);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border cursor-pointer
              ${
                selectedCategory === cat.value
                  ? "bg-white text-black shadow-md scale-105"
                  : "border-white/30 text-white hover:border-white hover:bg-white/10"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* FAQ LIST */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white/5 backdrop-blur-md border rounded-xl p-5 transition-all duration-300
            ${
              openIndex === index
                ? "border-[var(--color-accent)] shadow-lg"
                : "border-white/10"
            }`}>
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center text-left cursor-pointer">
              <span className="font-semibold text-white text-base">
                {item.question}
              </span>

              <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }}>
                <ChevronDown className="text-[var(--color-accent)]" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  style={{ transformOrigin: "top" }}
                  className="overflow-hidden">
                  <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
