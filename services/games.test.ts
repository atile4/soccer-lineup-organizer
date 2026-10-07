import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchSplit,
  updateSplit,
  createGameWithLineups,
  MaxGamesReachedError,
} from "./games";
import { MAX_GAMES } from "@/app/constants/playerLimits";

// This intercepts any import of "@/lib/supabase" in games.ts
// and replaces it with a fake object we control.
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

// fetchIsPremium is exercised on its own in premium.test.ts; here we only care
// about whether the game-limit guard calls it.
vi.mock("./premium", () => ({
  fetchIsPremium: vi.fn(),
}));

import { supabase } from "@/lib/supabase";
import { fetchIsPremium } from "./premium";

describe("updateSplit", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset the fake between tests so they don't leak into each other
  });

  // updateSplit goes through the set_game_split RPC, not a table update.
  it("calls set_game_split with the game id and split type", async () => {
    (supabase.rpc as any).mockResolvedValue({
      data: [{ id: "l-1", period: 0 }],
      error: null,
    });

    const result = await updateSplit("game-1", "half");

    expect(supabase.rpc).toHaveBeenCalledWith("set_game_split", {
      p_game_id: "game-1",
      p_split: "half",
    });
    expect(result).toEqual([{ id: "l-1", period: 0 }]);
  });

  it("throws when Supabase returns an error", async () => {
    (supabase.rpc as any).mockResolvedValue({
      data: null,
      error: { message: "Row not found" },
    });

    await expect(updateSplit("bad-id", "quarter")).rejects.toEqual({
      message: "Row not found",
    });
  });
});

describe("fetchSplit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the split_by value when the game is found", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { split_by: "quarter" },
      error: null,
    });

    const mockEq = vi.fn(() => ({ single: mockSingle }));
    const mockSelect = vi.fn(() => ({ eq: mockEq }));

    (supabase.from as any).mockReturnValue({ select: mockSelect });

    const result = await fetchSplit("game-1");

    expect(supabase.from).toHaveBeenCalledWith("games");
    expect(mockSelect).toHaveBeenCalledWith("split_by");
    expect(mockEq).toHaveBeenCalledWith("id", "game-1");
    expect(result).toBe("quarter");
  });

  it("throws when Supabase returns an error", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Row not found" },
    });
    const mockEq = vi.fn(() => ({ single: mockSingle }));
    const mockSelect = vi.fn(() => ({ eq: mockEq }));
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    await expect(fetchSplit("bad-id")).rejects.toEqual({
      message: "Row not found",
    });
  });
});

// createGameWithLineups now enforces MAX_GAMES, so it queries more than one
// table. These helpers stub `from` per-table instead of a single return value.
describe("createGameWithLineups limit", () => {
  const setMocks = ({
    gameCount,
    ownerId = "owner-1",
    isPremium = false,
  }: {
    gameCount: number | null;
    ownerId?: string;
    isPremium?: boolean;
  }) => {
    // A head/count select resolves off .eq() (the Supabase query builder is
    // thenable); a normal select resolves off .eq().single().
    const mockSelect = vi.fn((columns: string, options?: { head?: boolean }) =>
      options?.head
        ? {
            eq: vi.fn(() =>
              Promise.resolve({ count: gameCount, error: null }),
            ),
          }
        : {
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: { user_id: ownerId },
                error: null,
              }),
            })),
          },
    );

    (supabase.from as any).mockImplementation(() => ({ select: mockSelect }));
    (fetchIsPremium as any).mockResolvedValue(isPremium);
    (supabase.rpc as any).mockResolvedValue({
      data: { id: "game-new" },
      error: null,
    });
    return { mockSelect };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the game without a premium lookup when under the limit", async () => {
    const { mockSelect } = setMocks({ gameCount: MAX_GAMES - 1 });

    const game = await createGameWithLineups("team-1", "Game 4");

    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(mockSelect).toHaveBeenCalledWith("id", { count: "exact", head: true });
    // Never looked up the owner, never checked the allowlist
    expect(fetchIsPremium).not.toHaveBeenCalled();
    expect(supabase.rpc).toHaveBeenCalledWith("create_game_with_lineups", {
      p_team_id: "team-1",
      p_name: "Game 4",
      p_split: "none",
      p_notes: null,
    });
    expect(game).toEqual({ id: "game-new" });
  });

  it("throws MaxGamesReachedError and skips the RPC at the limit", async () => {
    setMocks({ gameCount: MAX_GAMES, isPremium: false });

    await expect(createGameWithLineups("team-1", "Game 4")).rejects.toBeInstanceOf(
      MaxGamesReachedError,
    );
    expect(fetchIsPremium).toHaveBeenCalledWith("owner-1");
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("allows a premium user past the limit", async () => {
    setMocks({ gameCount: MAX_GAMES, isPremium: true });

    const game = await createGameWithLineups("team-1", "Game 4");

    expect(fetchIsPremium).toHaveBeenCalledWith("owner-1");
    expect(supabase.rpc).toHaveBeenCalled();
    expect(game).toEqual({ id: "game-new" });
  });

  it("allows a premium user past the limit when the count query returns null", async () => {
    // A null count is treated as 0 — Supabase omits it on some responses, and
    // failing open here would be worse than the extra query.
    setMocks({ gameCount: null, isPremium: true });

    await createGameWithLineups("team-1", "Game 4");
    expect(supabase.rpc).toHaveBeenCalled();
  });

  it("propagates a count query error", async () => {
    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ count: null, error: { message: "DB down" } })),
      })),
    });

    await expect(createGameWithLineups("team-1", "Game 4")).rejects.toEqual({
      message: "DB down",
    });
    expect(supabase.rpc).not.toHaveBeenCalled();
  });
});