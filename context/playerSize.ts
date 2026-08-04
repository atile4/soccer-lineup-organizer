// Server-safe constants and helpers for the player-token size preference.
// Kept out of PlayerSizeContext.tsx (a "use client" module) so that server
// components — e.g. app/layout.tsx reading the cookie — can call parseScale
// directly. Importing plain functions across a "use client" boundary into a
// server component yields a client reference, not a callable function.
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 1.5;
export const STEP = 0.05;
export const DEFAULT_SCALE = 1;
export const COOKIE_NAME = "tokenScale";

export const clampScale = (n: number) =>
  Math.max(MIN_SCALE, Math.min(MAX_SCALE, n));

// Parse a raw cookie value into a valid scale, falling back to the default.
export function parseScale(raw: string | undefined | null): number {
  const n = Number(raw);
  return Number.isFinite(n) ? clampScale(n) : DEFAULT_SCALE;
}
