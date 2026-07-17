export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  team_id: string;
}

export interface Team {
  id: string;
  name: string;
  division: Division | null;
  gender: Gender;
  color: string;
}

// includes player count, which is not a column in the teams table
export interface TeamWithPlayerCount extends Team {
  playerCount: number;
}

export interface Game {
  id: string;
  team_id: string;
  name: string;
  split_by: SplitBy;
  notes: string;
}

export type Gender = "Boys" | "Girls" | "Coed";

export type Division = "U-8" | "U-10" | "U-12" | "U-14" | "U-16" | "U-18";

export type SplitBy = "none" | "half" | "quarter";

export interface Formation {
  name: string;
  positions: Position[];
}

export interface Position {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  label: string;
  playerId?: string;
}

export interface LineupState {
  formation: string;
  division: Division;
  positions: Position[];
}
