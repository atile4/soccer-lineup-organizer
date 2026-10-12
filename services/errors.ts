import { MAX_GAMES } from "@/app/constants/playerLimits";

// Thrown when a non-premium user is already at MAX_GAMES on a team, so the
// UI can show a limit message.
//
// Lives in its own module rather than services/games.ts so the client-only
// demo service (services/demoGames.ts) can throw the exact same class —
// `instanceof` checks in the UI keep working — without importing supabase
// transitively.
export class MaxGamesReachedError extends Error {
  constructor() {
    super(`You can have at most ${MAX_GAMES} games per team.`);
    this.name = "MaxGamesReachedError";
  }
}
