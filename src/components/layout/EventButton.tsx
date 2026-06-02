"use client";

import { Event } from "@/data/events";
import { track } from "@vercel/analytics";
import { FiArrowUpRight, FiImage } from "react-icons/fi";

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
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(201,168,76,0.12)",
          color: "var(--color-gold)",
        }}>
        <FiImage size={20} />
      </span>

      <span className="flex-1">
        <span
          className="block text-[15px] font-medium"
          style={{ color: "var(--color-foreground)" }}>
          {event.name}
        </span>
        {/* <span
          className="block text-[12px] mt-0.5"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          Portofolio event 
        </span> */}
      </span>

      <FiArrowUpRight
        size={18}
        style={{ color: "var(--color-gold)", flexShrink: 0 }}
      />
    </button>
  );
}
