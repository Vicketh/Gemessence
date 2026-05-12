import type React from "react";

interface LogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  variant?: "full" | "mark";
}

/**
 * SVG logo matching the official Gemessence logo PNG:
 * - Large crimson "G" letterform (thick stroke, open on right)
 * - Gold faceted gem/diamond shape centred inside the G
 * - Italic serif "Gemessence" wordmark to the right
 * - Thin gold decorative underline swoosh beneath the text
 * - Small 4-pointed gold star accent top-right of the mark
 */
export function GemessenceLogoSVG({
  className = "",
  height = 48,
  width,
  variant = "full",
}: LogoProps) {
  const vbW = variant === "full" ? 520 : 120;
  const vbH = 120;

  // Shared gem shape centred at (cx, cy) with half-height hh
  const Gem = ({ cx, cy, hh }: { cx: number; cy: number; hh: number }) => {
    const hw = hh * 0.62;
    const mh = hh * 0.28;
    return (
      <g>
        {/* crown */}
        <polygon points={`${cx},${cy - hh} ${cx + hw * 0.7},${cy - mh} ${cx - hw * 0.7},${cy - mh}`} fill="#C9A227" />
        {/* girdle */}
        <polygon points={`${cx - hw * 0.7},${cy - mh} ${cx + hw * 0.7},${cy - mh} ${cx + hw},${cy + mh} ${cx - hw},${cy + mh}`} fill="#E8C84A" />
        {/* pavilion */}
        <polygon points={`${cx - hw},${cy + mh} ${cx + hw},${cy + mh} ${cx},${cy + hh}`} fill="#C9A227" />
        {/* centre facet line */}
        <line x1={cx} y1={cy - hh} x2={cx} y2={cy + hh} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        <line x1={cx - hw * 0.7} y1={cy - mh} x2={cx + hw * 0.7} y2={cy - mh} stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className={className}
      style={{ height, width: width || "auto" }}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── MARK (G + gem + star) ── */}
      <g id="mark">
        {/* Thick crimson G — open arc on the right, horizontal bar mid-right */}
        <path
          d="M 95 18 A 42 42 0 1 0 95 102 L 95 72 L 72 72"
          fill="none"
          stroke="#8B0000"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Thin gold outline on G */}
        <path
          d="M 95 18 A 42 42 0 1 0 95 102 L 95 72 L 72 72"
          fill="none"
          stroke="#C9A227"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Gem centred inside the G */}
        <Gem cx={55} cy={60} hh={22} />

        {/* 4-pointed star top-right of mark */}
        <path
          d="M 100 12 L 102.5 19 L 110 21.5 L 102.5 24 L 100 31 L 97.5 24 L 90 21.5 L 97.5 19 Z"
          fill="#C9A227"
          opacity="0.9"
        />
      </g>

      {variant === "full" && (
        <g id="wordmark">
          {/* Italic serif wordmark */}
          <text
            x="128"
            y="74"
            fontSize="52"
            fontFamily="'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif"
            fontStyle="italic"
            fontWeight="600"
            fill="currentColor"
            letterSpacing="1"
          >
            Gemessence
          </text>

          {/* Decorative underline swoosh — crimson + gold */}
          <path
            d="M 128 84 Q 320 96 510 82"
            fill="none"
            stroke="#8B0000"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 128 84 Q 320 96 510 82"
            fill="none"
            stroke="#C9A227"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      )}
    </svg>
  );
}
