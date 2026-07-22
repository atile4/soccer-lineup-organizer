// Presentational jersey + name, with NO card background. Shared by the sidebar
// card, the bench, and the field so a player looks consistent everywhere.
// On the field we render this token by itself (background removed), leaving just
// the shirt icon and the player's name.

export type PlayerTokenVariant = "default" | "field" | "bench";

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
    svg: "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16",
    name: "text-xs sm:text-sm",
    gap: "gap-1 sm:gap-2",
  },
  field: {
    svg: "w-11 h-11",
    name: "text-[11px] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]",
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
  jerseyColor = "#7C3AED", // default: purple
  nameColor = "#9CA3AF", // default: gray
}: PlayerTokenProps) {
  const size = SIZES[variant];
  const isField = variant === "field";

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
          stroke="#1a1a1a"
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
          fill="white"
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
