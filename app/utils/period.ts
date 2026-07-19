import { SplitBy } from "../types";

export const SPLIT_PERIOD_COUNTS: Record<SplitBy, number> = {
  none: 1,
  half: 2,
  quarter: 4,
};

export function formatPeriodLabel(period: number, splitBy: SplitBy): string {
  const ordinal = period + 1; // periods are 0-indexed in the DB
  switch (splitBy) {
    case "quarter":
      return `Quarter ${ordinal}`;
    case "half":
      return `Half ${ordinal}`;
    case "none":
    default:
      return "Full Game";
  }
}

// Short label for the lineup-switching tabs, e.g. "Q1", "H2".
// Periods are 0-indexed in the DB, so the display ordinal is period + 1.
export function formatPeriodTab(period: number, splitBy: SplitBy): string {
  const ordinal = period + 1;
  switch (splitBy) {
    case "quarter":
      return `Q${ordinal}`;
    case "half":
      return `H${ordinal}`;
    case "none":
    default:
      return "Full";
  }
}

export function getPeriodsToRemove(from: SplitBy, to: SplitBy): number[] {
  const fromCount = SPLIT_PERIOD_COUNTS[from];
  const toCount = SPLIT_PERIOD_COUNTS[to];

  if (toCount >= fromCount) return [];

  const removed: number[] = [];
  for (let period = toCount + 1; period <= fromCount; period++) {
    removed.push(period);
  }
  return removed;
}
