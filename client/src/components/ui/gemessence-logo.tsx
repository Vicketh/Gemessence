interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
  height?: number;
  width?: number;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function GemessenceLogo({ className = "", height, width }: LogoProps) {
  const aspectRatio = 240 / 50; // SVG aspect ratio
  const resolvedHeight = height ?? 48;
  const resolvedWidth = width ?? Math.round(resolvedHeight * aspectRatio);

  return (
    <img
      src={`${BASE}/logo.svg`}
      alt="Gemessence"
      height={resolvedHeight}
      width={resolvedWidth}
      className={`object-contain ${className}`}
      draggable={false}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
    />
  );
}
