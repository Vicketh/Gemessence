import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { resolveImageUrl } from "@/lib/utils";

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
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const src = resolveImageUrl(
    isDark ? "/gemessence-logo-dark.png" : "/gemessence-logo.png"
  );

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt="Gemessence"
        style={{
          height,
          width: width ?? "auto",
          objectFit: "contain",
          display: "block",
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}
