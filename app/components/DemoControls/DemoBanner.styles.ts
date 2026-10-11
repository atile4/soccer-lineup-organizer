// DemoBanner.styles.ts

// Amber pill shown inside the accent-green app header while demo mode is
// active — the warm amber against the green header keeps the demo state
// obvious at a glance.
export const demoBannerStyles = {
  banner: {
    container: "flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1",
    text: "text-xs font-bold text-amber-950 whitespace-nowrap",
    exitButton:
      "rounded-md border border-amber-700/40 bg-white px-2 py-0.5 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
  },
};
