"use client";

// Client-only demo mode for logged-out visitors. Enabling it swaps every data
// context onto the frozen fixtures in app/data/demoFixtures.ts — nothing is
// ever persisted, and state resets on reload. Demo can only be enabled when
// there is no session; signing in mid-demo disables it automatically.

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import {
  DEMO_TEAM,
  DEMO_PLAYERS,
  DEMO_GAMES,
  DEMO_LINEUPS,
} from "@/app/data/demoFixtures";
import { TeamWithPlayerCount, Player, Game, Lineup } from "@/app/types";
import type { DemoGameState } from "@/services/demoGames";

interface DemoContextValue {
  isDemo: boolean;
  enable: () => void;
  disable: () => void;
  demoTeam: TeamWithPlayerCount | null;
  demoPlayers: Player[];
  demoGames: Game[];
  demoLineups: Lineup[];
  // Commit the result of a services/demoGames mutation. Writes are composed
  // outside this provider: callers run the pure function first, then hand
  // the next state here so every reader (GameContext, …) picks it up.
  applyDemoState: (next: DemoGameState) => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

// Stable empty identity so consumers that list demoPlayers in their effect
// deps don't re-run just because this provider re-rendered. Never mutated —
// consumers copy on write.
const NO_PLAYERS: Player[] = [];

export function DemoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  // Games/lineups are state (not just the fixture constants) so demo-mode
  // mutations — pure functions in services/demoGames.ts, committed via
  // applyDemoState — can update them without touching the real contexts.
  const [demoGames, setDemoGames] = useState<Game[]>([]);
  const [demoLineups, setDemoLineups] = useState<Lineup[]>([]);

  const enable = useCallback(() => {
    // Demo is a logged-out-only surface; there is nothing to preview for an
    // authenticated user, whose real data would be the better experience.
    if (session) return;
    setDemoGames(DEMO_GAMES);
    setDemoLineups(DEMO_LINEUPS);
    setIsDemo(true);
  }, [session]);

  const disable = useCallback(() => {
    setIsDemo(false);
    setDemoGames([]);
    setDemoLineups([]);
  }, []);

  const applyDemoState = useCallback((next: DemoGameState) => {
    setDemoGames(next.games);
    setDemoLineups(next.lineups);
  }, []);

  // Signing in during a demo (e.g. via the header's Log in button) silently
  // exits demo so real data can never be mixed with demo state.
  useEffect(() => {
    if (session && !isDemo) disable();
  }, [session, isDemo, disable]);

  const value = useMemo<DemoContextValue>(
    () => ({
      isDemo,
      enable,
      disable,
      demoTeam: isDemo ? DEMO_TEAM : null,
      demoPlayers: isDemo ? DEMO_PLAYERS : NO_PLAYERS,
      demoGames,
      demoLineups,
      applyDemoState,
    }),
    [isDemo, enable, disable, demoGames, demoLineups, applyDemoState],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within a DemoProvider");
  return ctx;
}
