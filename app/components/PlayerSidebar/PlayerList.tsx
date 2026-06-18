import { TempPlayer } from "@/app/types";
import PlayerCard from "./PlayerCard";
import { playerSidebarStyles } from "./PlayerSidebar.styles";

interface player {
  name: string;
  number: number;
}

interface PlayerListProps {
  players: TempPlayer[];
}

export const PlayerList = ({ players }: PlayerListProps) => {
  return (
    <aside className={playerSidebarStyles.playerList}>
      {players.length === 0 ? (
        <p className="text-sm text-gray-400">
          No players yet. Add one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {players.map((player) => (
            <PlayerCard
              key={player.name}
              name={player.name}
              number={player.number}
              // jerseyColor="#7C3AED"  ← change team color here
              // nameColor="#6B7280"    ← change name color here
            />
          ))}
        </div>
      )}
    </aside>
  );
};
