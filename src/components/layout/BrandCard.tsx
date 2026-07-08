import Image from "next/image";
import { FiInstagram } from "react-icons/fi";

export default function CardLink() {
  return (
    <div className="flex flex-col items-center px-7 pt-10 pb-8">
      {/* Logo */}
      <div
        className="w-[80px] h-[80px] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          // background: "var(--color-foreground)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}>
        <Image
          src="/logo/Asset-5.png"
          alt="Inferno Photobooth"
          width={88}
          height={88}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <div className="text-center mt-5">
        <h1
          className="text-[24px] font-semibold"
          style={{
            color: "white",
            letterSpacing: "0.02em",
          }}>
          Inferno Photobooth <br />
          <span className="text-[16px]">Bali Startup Expo Primakara</span>
        </h1>

        <p
          className="text-[12px] mt-2"
          style={{
            color: "rgba(255,255,255,0.65)",
          }}>
          Capture the Moment, Creating Stories
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-14 h-px my-5"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
        }}
      />

      {/* Social */}
      <a
        href="https://www.instagram.com/inferno.photobooth/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-70">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
          }}>
          <FiInstagram size={15} />
        </span>

        <span
          className="text-[13px]"
          style={{
            color: "rgba(255,255,255,0.72)",
          }}>
          @inferno.photobooth
        </span>
      </a>
    </div>
  );
}
