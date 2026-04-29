import type React from "react";
import logoPng from "@assets/Gemessence official logo.png";

interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
  height?: number | string;
  width?: number | string;
}

export function GemessenceLogo({
  className = "",
  height = 48,
  width,
}: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={logoPng}
        alt="Gemessence Official Logo"
        style={{ 
          height: height, 
          width: width || 'auto',
          filter: "drop-shadow(0 2px 4px rgba(201, 162, 39, 0.3)) brightness(1.05) contrast(1.1)"
        }}
        className="object-contain transition-transform duration-300 hover:scale-105"
        draggable={false}
      />
    </div>
  );
}
