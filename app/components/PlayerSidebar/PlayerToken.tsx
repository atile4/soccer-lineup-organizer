// Presentational jersey + name, no card background

export type PlayerTokenVariant = "default" | "field" | "bench";

// Pick a readable number color (black on light jerseys, white on dark ones).
function numberColorFor(jerseyColor: string): string {
  const hex = jerseyColor.trim().replace(/^#/, "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return "white";

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  // Perceived luminance (sRGB coefficients). Threshold ~0.6 favors readability.
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "black" : "white";
}

type PlayerTokenProps = {
  name: string;
  number: number;
  variant?: PlayerTokenVariant;
  jerseyColor?: string; // jersey fill color
  nameColor?: string; // player name text color (ignored for the "field" variant)
};

const SIZES: Record<
  PlayerTokenVariant,
  { svg: string; name: string; gap: string }
> = {
  default: {
    svg: "w-20 h-20 sm:w-14 sm:h-14 md:w-16 md:h-16",
    name: "text-lg sm:text-sm",
    gap: "gap-1 sm:gap-2",
  },
  field: {
    svg: "w-11 h-11 md:w-[48px] md:h-[48px] lg:w-11 lg:h-11",
    name: "text-[11px] md:text-[14px] lg:text-[11px] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]",
    gap: "gap-0.5",
  },
  bench: {
    svg: "w-9 h-9",
    name: "text-[10px]",
    gap: "gap-0.5",
  },
};

export default function PlayerToken({
  name,
  number,
  variant = "default",
  jerseyColor = "#7C3AED", // default jersey fill (user-selectable color data)
  nameColor = "var(--color-ink-2)", // default: body ink
}: PlayerTokenProps) {
  const size = SIZES[variant];
  const isField = variant === "field";
  const numberColor = numberColorFor(jerseyColor);

  return (
    <div className={`flex flex-col items-center justify-center ${size.gap}`}>
      {/* Jersey SVG */}
      <svg
        viewBox="0 0 100 90"
        xmlns="http://www.w3.org/2000/svg"
        className={size.svg}
      >
        {/* Jersey body */}
        <path
          d="M25 10 L10 30 L25 35 L25 80 L75 80 L75 35 L90 30 L75 10 C70 18 60 22 50 22 C40 22 30 18 25 10Z"
          fill={jerseyColor}
          stroke="var(--color-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Number */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="26"
          fontWeight="bold"
          fill={numberColor}
          fontFamily="Arial, sans-serif"
        >
          {number}
        </text>
      </svg>

      {/* Player name */}
      <p
        className={`font-semibold text-center leading-tight ${size.name}`}
        style={isField ? undefined : { color: nameColor }}
      >
        {name}
      </p>
    </div>
  );
}
