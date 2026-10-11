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

interface DemoContextValue {
  isDemo: boolean;
  enable: () => void;
  disable: () => void;
  demoTeam: TeamWithPlayerCount | null;
  demoPlayers: Player[];
  demoGames: Game[];
  demoLineups: Lineup[];
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [isDemo, setIsDemo] = useState(false);
  // Games/lineups are state (not just the fixture constants) so demo-mode
  // mutations in later phases can update them without touching real contexts.
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

  // Signing in during a demo (e.g. via the header's Log in button) silently
  // exits demo so real data can never be mixed with demo state.
  useEffect(() => {
    if (session) disable();
  }, [session, disable]);

  const value = useMemo<DemoContextValue>(
    () => ({
      isDemo,
      enable,
      disable,
      demoTeam: isDemo ? DEMO_TEAM : null,
      demoPlayers: isDemo ? DEMO_PLAYERS : [],
      demoGames,
      demoLineups,
    }),
    [isDemo, enable, disable, demoGames, demoLineups],
  );

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within a DemoProvider");
  return ctx;
}
