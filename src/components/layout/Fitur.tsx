import { motion } from "framer-motion";

type Item = {
  title: string;
  desc: string;
};

type Props = {
  title: string;
  data: Item[];
};

export default function FiturSection({ title, data }: Props) {
  return (
    <section
      id="fitur"
      className="py-20"
      style={{ background: "var(--color-background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.map((item, i) => (
            <motion.div
              key={i}
              className="relative bg-[var(--color-card)] rounded-lg p-6 shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-[var(--color-accent)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ scale: 1.03 }}>
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 rounded-lg pointer-events-none">
                <div className="absolute inset-0 bg-white/5 blur-xl"></div>
              </div>

              <h3
                className="text-white font-semibold mb-2 relative z-10"
                style={{ color: "var(--color-background-solid)" }}>
                {item.title}
              </h3>

              <p className="text-sm text-black relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
