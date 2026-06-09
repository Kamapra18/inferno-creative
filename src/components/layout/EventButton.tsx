"use client";

import { Event } from "@/data/PortoPhotobooth";
import { track } from "@vercel/analytics";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";

export default function EventButton({ event }: { event: Event }) {
  const url = event.frame;

  const openLink = () => {
    if (!url) return;
    track("frame_click", { event: event.slug });
    window.open(url, "_blank");
  };

  if (!url) return null;

  return (
    <button
      onClick={openLink}
      className="w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-200 hover:scale-[0.985]"
      style={{
        background: "var(--color-box)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}>
      <span
        className="w-12 h-12 rounded-2xl flex-shrink-0 overflow-hidden relative"
        style={{
          background: "var(--color-box)",
        }}>
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </span>

      <span className="flex-1">
        <span
          className="block text-[15px] font-medium"
          style={{ color: "var(--color-foreground)" }}>
          {event.name}
        </span>
      </span>

      <FiArrowUpRight
        size={18}
        style={{ color: "var(--color-gold)", flexShrink: 0 }}
      />
    </button>
  );
}
