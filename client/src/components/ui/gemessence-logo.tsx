import type React from "react";
import { GemessenceLogoSVG } from "./gemessence-logo-svg";

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
  variant = "full",
}: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <GemessenceLogoSVG
        variant={variant}
        height={height}
        width={width}
        className="block h-auto w-auto drop-shadow-md transition-all duration-300"
      />
    </div>
  );
}
