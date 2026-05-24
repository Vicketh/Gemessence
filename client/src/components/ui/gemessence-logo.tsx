import type React from "react";
import { GemessenceLogoSVG } from "./gemessence-logo-svg";
import logoImage from "@/assets/gemessence-logo.png";

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
  const style = { height, width: width ?? "auto" };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {variant === "mark" ? (
        <GemessenceLogoSVG
          variant="mark"
          height={height}
          width={width}
          className="drop-shadow-md hover:drop-shadow-lg transition-all duration-300"
        />
      ) : (
        <img
          src={logoImage}
          alt="Gemessence logo"
          style={style}
          className="block max-w-full h-auto object-contain drop-shadow-md transition-all duration-300"
          loading="eager"
        />
      )}
    </div>
  );
}
