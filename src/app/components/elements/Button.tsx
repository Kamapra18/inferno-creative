"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ children, href, ...props }) => {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 border-3  rounded transition-colors duration-300"
      style={{
        color: "var(--color-accent)",
        borderColor: "var(--color-accent)",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--color-accent)";
        e.currentTarget.style.color = "var(--color-white)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--color-accent)";
      }}
      {...props}>
      {children}
      <ArrowRight size={18} />
    </a>
  );
};

export default Button;
