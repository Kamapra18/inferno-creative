"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ children, href, ...props }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 border-3 rounded transition-colors duration-300"
      style={{
        color: "var(--color-foreground)",
        borderColor: "var(--color-foreground)",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-accent)";
        e.currentTarget.style.color = "var(--color-white)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--color-foreground)";
      }}
      {...props}>
      {children}
      <ArrowRight size={18} />
    </Link>
  );
};

export default Button;
