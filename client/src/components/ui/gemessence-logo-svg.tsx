import type React from "react";

interface LogoProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  variant?: "full" | "mark";
}

export function GemessenceLogoSVG({
  className = "",
  height = 48,
  width,
  variant = "full",
}: LogoProps) {
  const viewBoxWidth = variant === "full" ? 1200 : 300;
  const viewBoxHeight = 300;
  
  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className={`${className}`}
      style={{ height, width: width || "auto" }}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "full" ? (
        // Full logo with text
        <g>
          {/* 8-Pointed Star */}
          <g id="star">
            <path
              d="M 900 40 L 910 80 L 950 90 L 910 100 L 900 140 L 890 100 L 850 90 L 890 80 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="900" cy="90" r="3" fill="#D4AF37" />
          </g>

          {/* Main G Shape with Gem Inside */}
          <g id="logo-mark">
            {/* Red/Crimson G Outer Shape */}
            <path
              d="M 150 80 Q 80 80 80 150 Q 80 220 150 220 Q 200 220 230 190 L 200 160 Q 185 175 150 175 Q 110 175 110 150 Q 110 125 150 125 Q 180 125 200 145 L 230 115 Q 200 85 150 80 Z"
              fill="none"
              stroke="#DC143C"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gold/Yellow outline for G */}
            <path
              d="M 150 80 Q 80 80 80 150 Q 80 220 150 220 Q 200 220 230 190 L 200 160 Q 185 175 150 175 Q 110 175 110 150 Q 110 125 150 125 Q 180 125 200 145 L 230 115 Q 200 85 150 80 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />

            {/* Gem Shape Inside G */}
            <g id="gem" transform="translate(140, 130)">
              {/* Top triangle (diamond) */}
              <polygon
                points="0,-25 15,-5 -15,-5"
                fill="#D4AF37"
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              {/* Middle diamond/square */}
              <polygon
                points="0,-5 25,15 0,35 -25,15"
                fill="#D4AF37"
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              {/* Bottom triangle */}
              <polygon
                points="0,35 15,55 -15,55"
                fill="#D4AF37"
                stroke="#1a1a1a"
                strokeWidth="2"
              />
              {/* Inner highlights */}
              <line x1="0" y1="-25" x2="0" y2="55" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4" />
            </g>
          </g>

          {/* Gemessence Text */}
          <text
            x="350"
            y="170"
            fontSize="140"
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fill="#1a1a1a"
            fontWeight="500"
            letterSpacing="2"
          >
            Gemessence
          </text>

          {/* Decorative swoosh line */}
          <path
            d="M 350 200 Q 600 215 950 190"
            fill="none"
            stroke="#DC143C"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 350 200 Q 600 215 950 190"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      ) : (
        // Mark only (for favicon, etc.)
        <g id="mark-only">
          {/* 8-Pointed Star */}
          <g id="star">
            <path
              d="M 200 40 L 210 80 L 250 90 L 210 100 L 200 140 L 190 100 L 150 90 L 190 80 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="200" cy="90" r="3" fill="#D4AF37" />
          </g>

          {/* Red/Crimson G */}
          <path
            d="M 100 80 Q 40 80 40 150 Q 40 220 100 220 Q 140 220 160 190 L 140 165 Q 130 175 100 175 Q 70 175 70 150 Q 70 125 100 125 Q 120 125 140 145 L 160 120 Q 140 85 100 80 Z"
            fill="none"
            stroke="#DC143C"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gold outline */}
          <path
            d="M 100 80 Q 40 80 40 150 Q 40 220 100 220 Q 140 220 160 190 L 140 165 Q 130 175 100 175 Q 70 175 70 150 Q 70 125 100 125 Q 120 125 140 145 L 160 120 Q 140 85 100 80 Z"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {/* Gem Shape */}
          <g id="gem" transform="translate(90, 140)">
            {/* Top triangle */}
            <polygon
              points="0,-20 12,-3 -12,-3"
              fill="#D4AF37"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            {/* Middle diamond */}
            <polygon
              points="0,-3 20,12 0,27 -20,12"
              fill="#D4AF37"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            {/* Bottom triangle */}
            <polygon
              points="0,27 12,42 -12,42"
              fill="#D4AF37"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            {/* Inner line */}
            <line x1="0" y1="-20" x2="0" y2="42" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
          </g>
        </g>
      )}
    </svg>
  );
}
