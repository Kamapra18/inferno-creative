"use client";

import { Event } from "@/data/events";
import { useRef, useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import {
  FiChevronDown,
  FiArrowUpRight,
  FiFolder,
  FiVideo,
  FiImage,
} from "react-icons/fi";

const LINKS = [
  {
    type: "video_click",
    icon: FiVideo,
    label: "Video",
    sub: "Akses video Gif event",
  },
  {
    type: "frame_click",
    icon: FiImage,
    label: "Photo With Frame",
    sub: "Download foto dengan frame",
  },
  {
    type: "raw_click",
    icon: FiFolder,
    label: "Raw Photos",
    sub: "Semua foto original",
  },
];

export default function EventAccordion({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    track("visit_event", { event: event.slug });
  }, [event.slug]);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight);
    }
  }, [open]);

  const urls: Record<string, string> = {
    video_click: event.video ?? "",
    frame_click: event.frame,
    raw_click: event.raw ?? "",
  };

  const openLink = (type: string) => {
    track(type, { event: event.slug });
    window.open(urls[type], "_blank");
  };

  return (
    <div
      className="rounded-[28px] overflow-hidden"
      style={{
        background: open ? "rgba(255,255,255,0.09)" : "var(--color-box)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.25s ease",
      }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left">
        <div>
          <h3
            className="text-[15px] font-medium"
            style={{
              color: "var(--color-foreground)",
            }}>
            {event.name}
          </h3>

          <p
            className="text-[11px] mt-1"
            style={{
              color: "rgba(255,255,255,0.55)",
            }}>
            {LINKS.length} akses tersedia
          </p>
        </div>

        <span
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
          <FiChevronDown
            size={17}
            style={{
              color: "var(--color-gold)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </span>
      </button>

      {/* Body */}
      <div
        ref={bodyRef}
        style={{
          maxHeight: open ? `${height}px` : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s",
        }}>
        <div className="px-6 pb-5 flex flex-col gap-2">
          {LINKS.map(({ type, icon: Icon, label, sub }) => (
            <button
              key={type}
              onClick={() => openLink(type)}
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:scale-[0.985]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  color: "var(--color-gold)",
                }}>
                <Icon size={17} />
              </span>

              <span className="flex-1">
                <span
                  className="block text-[13px] font-medium"
                  style={{
                    color: "white",
                  }}>
                  {label}
                </span>

                <span
                  className="block text-[11px] mt-0.5"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                  }}>
                  {sub}
                </span>
              </span>

              <FiArrowUpRight
                size={15}
                style={{
                  color: "var(--color-gold)",
                  flexShrink: 0,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
