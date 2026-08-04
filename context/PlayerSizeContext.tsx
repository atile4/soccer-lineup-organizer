"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { COOKIE_NAME, DEFAULT_SCALE, clampScale } from "./playerSize";

// Player-token size is a per-device UI preference (how large field/bench tokens
// render), not team data. It persists to a browser cookie only — never Supabase.
// Constants and parseScale live in ./playerSize so server components can use
// them (see the file's note); re-exported here for client consumers.
export {
  MIN_SCALE,
  MAX_SCALE,
  STEP,
  DEFAULT_SCALE,
  COOKIE_NAME,
  parseScale,
} from "./playerSize";

interface PlayerSizeContextValue {
  scale: number;
  setScale: (n: number) => void;
}

const PlayerSizeContext = createContext<PlayerSizeContextValue | undefined>(
  undefined,
);

export function PlayerSizeProvider({
  initialScale = DEFAULT_SCALE,
  children,
}: {
  // Seeded from the cookie on the server (see app/layout.tsx) so the saved size
  // is correct on first paint — no flash back to the default.
  initialScale?: number;
  children: ReactNode;
}) {
  const [scale, setScaleState] = useState<number>(() =>
    clampScale(initialScale),
  );

  const setScale = useCallback((n: number) => {
    const next = clampScale(n);
    setScaleState(next);
    Cookies.set(COOKIE_NAME, String(next), { expires: 365 });
  }, []);

  return (
    <PlayerSizeContext.Provider value={{ scale, setScale }}>
      {children}
    </PlayerSizeContext.Provider>
  );
}

export function usePlayerSize() {
  const ctx = useContext(PlayerSizeContext);
  if (!ctx)
    throw new Error("usePlayerSize must be used within a PlayerSizeProvider");
  return ctx;
}
