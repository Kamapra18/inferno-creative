"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface OrderProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

const Order: React.FC<OrderProps> = ({ children, href, ...props }) => {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 border-2 rounded transition-colors duration-300"
      style={{
        color: "var(--color-foreground)",
        borderColor: "var(--color-background)",
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.4)",
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

export default Order;
