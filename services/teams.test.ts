import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTeam,
  MaxTeamsReachedError,
} from "./teams";
import { MAX_TEAMS } from "@/app/constants/playerLimits";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

// fetchIsPremium is covered in premium.test.ts; here we only assert whether the
// team-limit guard calls it.
vi.mock("./premium", () => ({
  fetchIsPremium: vi.fn(),
}));

// createTeamWithDefaultGame delegates to the RPC-backed game service, which has
// its own tests in games.test.ts.
vi.mock("./games", () => ({
  createGameWithLineups: vi.fn(),
}));

import { supabase } from "@/lib/supabase";
import { fetchIsPremium } from "./premium";

describe("createTeam limit", () => {
  const setMocks = ({
    teamCount,
    isPremium = false,
  }: {
    teamCount: number | null;
    isPremium?: boolean;
  }) => {
    // The count query is a head select that resolves off .eq() (the Supabase
    // query builder is thenable). The insert hangs off .from() directly.
    const mockCountEq = vi.fn(() =>
      Promise.resolve({ count: teamCount, error: null }),
    );
    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({
          data: {
            id: "team-new",
            name: "Rockets",
            division: "U-12",
            gender: "Coed",
            color: "red",
          },
          error: null,
        }),
      })),
    }));
    const mockSelect = vi.fn(
      (columns: string, options?: { head?: boolean }) => ({
        eq: options?.head ? mockCountEq : vi.fn(),
      }),
    );

    (supabase.from as any).mockImplementation(() => ({
      select: mockSelect,
      insert: mockInsert,
    }));
    (fetchIsPremium as any).mockResolvedValue(isPremium);
    return { mockSelect };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts without a premium lookup when under the limit", async () => {
    const { mockSelect } = setMocks({ teamCount: MAX_TEAMS - 1 });

    const team = await createTeam("user-1", "Rockets", "U-12", "Coed", "red");

    // One count query, then the insert — no owner lookup, no allowlist check.
    expect(supabase.from).toHaveBeenCalledTimes(2);
    expect(mockSelect).toHaveBeenCalledWith("id", { count: "exact", head: true });
    expect(fetchIsPremium).not.toHaveBeenCalled();
    expect(team.id).toBe("team-new");
  });

  it("throws MaxTeamsReachedError and skips the insert at the limit", async () => {
    setMocks({ teamCount: MAX_TEAMS, isPremium: false });

    await expect(
      createTeam("user-1", "Rockets", "U-12", "Coed", "red"),
    ).rejects.toBeInstanceOf(MaxTeamsReachedError);

    expect(fetchIsPremium).toHaveBeenCalledWith("user-1");
    // Only the count query — never reached the insert
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it("allows a premium user past the limit", async () => {
    setMocks({ teamCount: MAX_TEAMS, isPremium: true });

    const team = await createTeam("user-1", "Rockets", "U-12", "Coed", "red");

    expect(fetchIsPremium).toHaveBeenCalledWith("user-1");
    expect(team.id).toBe("team-new");
  });

  it("propagates a count query error", async () => {
    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() =>
          Promise.resolve({ count: null, error: { message: "DB down" } }),
        ),
      })),
    });

    await expect(
      createTeam("user-1", "Rockets", "U-12", "Coed", "red"),
    ).rejects.toEqual({ message: "DB down" });
  });
});