"use client";

import { FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IconType } from "react-icons";

interface SocialIconProps {
  Icon: IconType;
  href: string;
}

function SocialIcon({ Icon, href }: SocialIconProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon
        className="text-2xl cursor-pointer transition-colors"
        style={{
          color: "var(--color-foreground)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--color-accent)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-foreground)")
        }
      />
    </a>
  );
}

export default function FooterContact() {
  return (
    <div>
      <h2 className="text-lg font-bold">Get in touch</h2>
      <p className="mt-2" style={{ color: "var(foreground)" }}>
        My social media account
      </p>
      <div className="flex space-x-4 mt-4">
        <SocialIcon
          Icon={FaInstagram}
          href="https://www.instagram.com/mario_prayoga46/"
        />
        <SocialIcon Icon={FaTiktok} href="https://www.tiktok.com/@kamapra18" />
        <SocialIcon Icon={FaWhatsapp} href="https://wa.me/081547473104" />
      </div>
    </div>
  );
}
