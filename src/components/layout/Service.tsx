"use client";

import { motion } from "framer-motion";

type Item = {
  title: string;
  desc: string;
  icon: React.ElementType;
};

type Props = {
  title: string;
  desc: string;
  data: Item[];
};

export default function ServiceDetail({ title, desc, data }: Props) {
  return (
    <section className="py-20 px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          {title}
        </motion.h2>
        <motion.p className="text-white text-lg mb-12">{desc}</motion.p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                className="relative rounded-xl border border-white/40 p-6 group hover:border-white/60 transition cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ scale: 1.03 }}>
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl pointer-events-none">
                  <div className="absolute inset-0 bg-white/5 blur-xl"></div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  {/* ICON */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition">
                      <Icon className="text-white text-xl" />
                    </div>
                  </div>

                  {/* TEXT */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-muted)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
