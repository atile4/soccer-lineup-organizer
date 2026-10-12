// Static data for the logged-out demo mode. 

import type { Game, Lineup, Player, TeamWithPlayerCount } from "@/app/types";

export const DEMO_TEAM_ID = "demo-team";

// A full starting roster. Ids are stable and namespaced so demo players can
// never collide with real rows if the two ever meet in a component.
export const DEMO_PLAYERS: Player[] = Object.freeze([
  { id: "demo-p1", name: "John Doe", number: 1, position: "GK", team_id: DEMO_TEAM_ID },
  { id: "demo-p2", name: "Jordan Lam", number: 2, position: "DEF", team_id: DEMO_TEAM_ID },
  { id: "demo-p3", name: "Jeffrey Lee", number: 3, position: "DEF", team_id: DEMO_TEAM_ID },
  { id: "demo-p4", name: "Brian Johnson", number: 4, position: "DEF", team_id: DEMO_TEAM_ID },
  { id: "demo-p5", name: "Jaden Wang", number: 5, position: "MID", team_id: DEMO_TEAM_ID },
  { id: "demo-p6", name: "Simone Li", number: 6, position: "MID", team_id: DEMO_TEAM_ID },
  { id: "demo-p7", name: "Mark Vuong", number: 7, position: "MID", team_id: DEMO_TEAM_ID },
  { id: "demo-p8", name: "Ryan Lue", number: 8, position: "FWD", team_id: DEMO_TEAM_ID },
  { id: "demo-p9", name: "John Irvine", number: 9, position: "FWD", team_id: DEMO_TEAM_ID },
  { id: "demo-p10", name: "Jayden Chou", number: 10, position: "MID", team_id: DEMO_TEAM_ID },
  { id: "demo-p11", name: "Dillon Tang", number: 11, position: "FWD", team_id: DEMO_TEAM_ID },
]) as Player[];

// Color is a hex string (same shape TeamBuilder produces) so jersey rendering
// works unmodified.
export const DEMO_TEAM: TeamWithPlayerCount = Object.freeze({
  id: DEMO_TEAM_ID,
  name: "Demo Team",
  division: "U-14",
  gender: "Coed",
  color: "#2563eb",
  playerCount: DEMO_PLAYERS.length,
});

// One game split into quarters, mirroring what the create_game_with_lineups
// RPC produces: periods 0..n-1, current lineup points at period 0. One game is
// seeded so there is room to exercise game creation up to MAX_GAMES in demo.
export const DEMO_GAMES: Game[] = Object.freeze([
  {
    id: "demo-g1",
    team_id: DEMO_TEAM_ID,
    name: "Saturday vs. Irvine",
    split_by: "quarter",
    notes: "",
    current_lineup_id: "demo-l1",
  },
]) as Game[];

export const DEMO_LINEUPS: Lineup[] = Object.freeze([
  { id: "demo-l1", game_id: "demo-g1", period: 0, formation: null },
  { id: "demo-l2", game_id: "demo-g1", period: 1, formation: null },
  { id: "demo-l3", game_id: "demo-g1", period: 2, formation: null },
  { id: "demo-l4", game_id: "demo-g1", period: 3, formation: null },
]) as Lineup[];
