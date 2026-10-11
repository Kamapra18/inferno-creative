"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  target?: string;
}

const ButtonCard: React.FC<ButtonProps> = ({ children, href, className = "", ...props }) => {
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 border border-red-400/50 shadow-lg shadow-red-950/60 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer shrink-0 ${className}`}
      {...props}>
      <span className="text-white font-bold drop-shadow-sm">{children}</span>
      <ArrowRight size={16} className="text-white shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
    </a>
  );
};

export default ButtonCard;
