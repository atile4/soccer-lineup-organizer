import PlayerToken from "./PlayerToken";

type PlayerCardProps = {
  name: string;
  number: number;
  jerseyColor?: string; // jersey fill color
  nameColor?: string; // player name text color
};

// The sidebar card: a PlayerToken wrapped in the rounded gray background.
// On the field the token is rendered on its own (see FieldPlayer), which is how
// the background gets "removed" once a player is placed.
export default function PlayerCard({
  name,
  number,
  jerseyColor,
  nameColor,
}: PlayerCardProps) {
  return (
    <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-2 sm:p-3 aspect-square hover:bg-gray-200 transition-colors">
      <PlayerToken
        name={name}
        number={number}
        jerseyColor={jerseyColor}
        nameColor={nameColor}
      />
    </div>
  );
}
