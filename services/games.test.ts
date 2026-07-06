import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchSplit, updateSplit } from "./games";

// This intercepts any import of "@/lib/supabase" in games.ts
// and replaces it with a fake object we control.
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from "@/lib/supabase";

describe("updateSplit", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset the fake between tests so they don't leak into each other
  });

  it("sends the correct table, column, and id to Supabase", async () => {
    // Arrange: build the fake chain, ending in a successful response
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "game-1", split_by: "half" },
      error: null,
    });
    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockEq = vi.fn(() => ({ select: mockSelect }));
    const mockUpdate = vi.fn(() => ({ eq: mockEq }));
    (supabase.from as any).mockReturnValue({ update: mockUpdate });

    // Act
    const result = await updateSplit("game-1", "half");

    // Assert: did our function call Supabase correctly?
    expect(supabase.from).toHaveBeenCalledWith("games");
    expect(mockUpdate).toHaveBeenCalledWith({ split_by: "half" });
    expect(mockEq).toHaveBeenCalledWith("id", "game-1");

    // Assert: did it return the right data?
    expect(result).toEqual({ id: "game-1", split_by: "half" });
  });

  it("throws when Supabase returns an error", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Row not found" },
    });
    const mockSelect = vi.fn(() => ({ single: mockSingle }));
    const mockEq = vi.fn(() => ({ select: mockSelect }));
    const mockUpdate = vi.fn(() => ({ eq: mockEq }));
    (supabase.from as any).mockReturnValue({ update: mockUpdate });

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
			error: null 
		});

    const mockEq = vi.fn(() => ({ single: mockSingle }));
    const mockSelect = vi.fn(() => ({ eq: mockEq }));
	
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    const result = await fetchSplit('game-1')

		expect(supabase.from).toHaveBeenCalledWith("games")
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

    await expect(fetchSplit("bad-id")).rejects.toEqual({ message: "Row not found" });
  });

});