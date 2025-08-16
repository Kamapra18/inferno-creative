"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqWeb, faqDokumentasi } from "./data/FAQ";

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "web" | "dokumentasi"
  >("web");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = selectedCategory === "web" ? faqWeb : faqDokumentasi;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white px-6">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}>
        <h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: "var(--color-foreground)" }}>
          FAQ
        </h1>
        <p className="text-gray-600">
          Punya pertanyaan? Mungkin jawabannya sudah ada di sini!
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {["web", "dokumentasi"].map((type) => (
          <button
            key={type}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 border-2 ${
              selectedCategory === type
                ? "bg-[var(--color-accent)] text-white"
                : "border-[var(--color-accent)] text-[var(--color-accent)]"
            }`}
            onClick={() => setSelectedCategory(type as "web" | "dokumentasi")}>
            {type === "web" ? "Web Undangan" : "Dokumentasi / Prewedding"}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((item, index) => (
          <motion.div
            key={index}
            className="bg-[var(--color-background)] rounded-xl p-4 shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}>
            <button
              className="w-full text-left flex justify-between items-center font-medium text-md"
              onClick={() => toggleAccordion(index)}>
              <span>{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-[var(--color-accent)]" />
              ) : (
                <ChevronDown className="text-[var(--color-accent)]" />
              )}
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.p
                  className="mt-3 text-sm text-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}>
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
