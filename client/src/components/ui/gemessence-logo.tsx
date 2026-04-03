interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
  height?: number;
  width?: number;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function GemessenceLogo({ className = "", height, width }: LogoProps) {
  const aspectRatio = 1536 / 1024; // Updated to match official logo dimensions
  const resolvedHeight = height ?? (width ? Math.round(width / aspectRatio) : 48);
  const resolvedWidth = width ?? (height ? Math.round(height * aspectRatio) : Math.round(48 * aspectRatio));

  return (
    <img
      src={`${BASE}/logo.png`}
      alt="Gemessence"
      height={resolvedHeight}
      width={resolvedWidth}
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}
