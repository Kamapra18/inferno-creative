import Image from "next/image";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import Link from "next/link";

const socials = [
  {
    href: "https://www.instagram.com/inferno.photobooth/",
    icon: <FiInstagram size={18} />,
  },
  {
    href: "https://wa.me/6285645150857/?text=Halo%2C%20saya%20tertarik%20untuk%20memesan%20photobooth%20.%20Boleh%20minta%20informasi%20mengenai%20paket%20dan%20harganya%3F",
    icon: <FaWhatsapp size={18} />,
  },
  {
    href: "https://www.tiktok.com/@infernocreativee",
    icon: <FaTiktok size={18} />,
  },
];

export default function BrandCard() {
  return (
    <div className="flex flex-col items-center px-7 pt-10 pb-8">
      {/* Logo */}
      <div
        className="w-[80px] h-[80px] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}>
        <Link href="/photobooth-bali">
          <Image
            src="/logo/Asset-5.png"
            alt="Inferno Photobooth"
            width={88}
            height={88}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Title */}
      <div className="text-center mt-5">
        <Link href="/photobooth-bali">
          <h1
            className="text-[24px] font-semibold"
            style={{
              color: "white",
              letterSpacing: "0.02em",
            }}>
            Inferno Photobooth
          </h1>
        </Link>

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
      <div className="flex flex-row gap-4 items-center justify-center">
        {socials.map(({ href, icon }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-70">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}>
              {icon}
            </span>
          </a>
        ))}
      </div>

      <div
        className="w-full h-px my-2 mt-4"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
        }}
      />
    </div>
  );
}
