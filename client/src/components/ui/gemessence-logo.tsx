import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  /** "full" = mark + text (default), "mark" = icon only */
  variant?: "full" | "mark";
  className?: string;
  height?: number;
  width?: number;
}

export function GemEssenceLogo({
  variant = "full",
  className = "",
  height,
  width,
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (variant === "mark") {
    // Icon-only: inline SVG so it scales perfectly at any size
    const gold = isDark ? "#F4D03F" : "#D4AF37";
    const goldDark = isDark ? "#D4AF37" : "#B8860B";
    const red = isDark ? "#E00000" : "#C00000";
    const bg = isDark ? "#1a0a00" : "#fff8ee";
    const ringOpacity = isDark ? "0.8" : "0.6";

    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={height}
        className={className}
        aria-label="GemEssence"
        role="img"
      >
        <defs>
          <linearGradient id={`gf-${isDark}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gold} />
            <stop offset="50%" stopColor={isDark ? "#FFE566" : "#F4D03F"} />
            <stop offset="100%" stopColor={goldDark} />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill={bg} opacity="0.95" />
        <circle cx="32" cy="32" r="29" stroke={`url(#gf-${isDark})`} strokeWidth="1.5" fill="none" opacity={ringOpacity} />
        <text x="32" y="46" fontFamily="Georgia, serif" fontSize="40" fontWeight="700" textAnchor="middle" fill={red}>G</text>
        <text x="32" y="46" fontFamily="Georgia, serif" fontSize="40" fontWeight="700" textAnchor="middle" fill="none" stroke={`url(#gf-${isDark})`} strokeWidth="0.8" opacity="0.8">G</text>
        <g transform="translate(40,24)">
          <polygon points="6,0 12,5 6,14 0,5" fill={`url(#gf-${isDark})`} />
          <line x1="6" y1="0" x2="6" y2="14" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="5" x2="12" y2="5" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
        </g>
        <g transform="translate(52,10)" fill={`url(#gf-${isDark})`}>
          <polygon points="3,0 3.8,2.2 6,3 3.8,3.8 3,6 2.2,3.8 0,3 2.2,2.2" />
        </g>
      </svg>
    );
  }

  // Full logo: swap SVG src based on theme — no flicker because we pre-mount
  const src = isDark ? "/logo-dark.svg" : "/logo-light.svg";
  const aspectRatio = 420 / 160;
  const resolvedWidth = width ?? (height ? Math.round(height * aspectRatio) : 160);
  const resolvedHeight = height ?? (width ? Math.round(width / aspectRatio) : 61);

  return (
    <img
      src={src}
      alt="GemEssence"
      height={resolvedHeight}
      width={resolvedWidth}
      className={`transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"} ${className}`}
      draggable={false}
    />
  );
}
