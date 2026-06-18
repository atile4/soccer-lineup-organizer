type PlayerCardProps = {
  name: string;
  number: number;
  jerseyColor?: string; // jersey fill color
  nameColor?: string; // player name text color
};

export default function PlayerCard({
  name,
  number,
  jerseyColor = "#7C3AED", // default: purple
  nameColor = "#9CA3AF", // default: gray
}: PlayerCardProps) {
  return (
    <div className="bg-gray-100 rounded-2xl flex flex-col items-center justify-center p-3 gap-2 aspect-square cursor-pointer hover:bg-gray-200 transition-colors">
      {/* Jersey SVG */}
      <svg
        viewBox="0 0 100 90"
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16"
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
        className="text-sm font-semibold text-center leading-tight"
        style={{ color: nameColor }}
      >
        {name}
      </p>
    </div>
  );
}
