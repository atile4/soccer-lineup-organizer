// Two color themes, matching the original Claude Design mockup.
// Applied as CSS custom properties on the root wrapper, then referenced
// by Tailwind's arbitrary-value syntax, e.g. bg-[var(--card)].
export const themeVars = {
  notebook: {
    "--paper": "#fdf8e3",
    "--ink": "#26312b",
    "--muted": "#6f776b",
    "--line": "#e6dcb6",
    "--field-bg": "#fffdf6",
    "--card": "#fffdf6",
    "--green": "#177e3e",
    "--green-d": "#0f5c2c",
    "--send": "#2f8a29",
    "--send-d": "#2a7a25",
    "--warn": "#dc2626",
    "--warn-bg": "#fdecec",
    "--chip": "#eef1e9",
  },
  turf: {
    "--paper": "#0a2e18",
    "--ink": "#eef6ef",
    "--muted": "#a7c8b2",
    "--line": "#1c5b35",
    "--field-bg": "#0f3a21",
    "--card": "#103c22",
    "--green": "#1f9d57",
    "--green-d": "#178047",
    "--send": "#1f9d57",
    "--send-d": "#178047",
    "--warn": "#ff9089",
    "--warn-bg": "#3a1a1a",
    "--chip": "#16482a",
  },
} as const;

export const teamBuilderStyles = {
  page: "min-h-full bg-[var(--paper)] text-[var(--ink)]",
  container: "max-w-[1180px] mx-auto px-4 pt-6 pb-24",

  headingRow: "flex items-end justify-between gap-4 flex-wrap mb-5",
  eyebrow:
    "font-['Caveat',cursive] text-xl font-bold text-[var(--green)] leading-none",
  title: "text-3xl font-extrabold tracking-tight mt-1",
  subtitle: "text-sm text-[var(--muted)] mt-1.5 max-w-[52ch]",
  headingActions: "flex items-center gap-3",
  playerCountLabel: "text-sm text-[var(--muted)]",
  saveButton:
    "px-5 py-2.5 text-sm font-bold text-white bg-[var(--send)] rounded-xl shadow-[0_2px_0_var(--send-d)] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition",
  themeToggle:
    "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--chip)] transition",

  grid: "grid grid-cols-1 md:grid-cols-[340px_1fr] gap-5 items-start",

  // Left card: team details
  detailsCard:
    "bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-sm p-5 md:sticky md:top-4",
  cardTitle: "text-base font-bold mb-4 flex items-center gap-2",
  cardIcon:
    "w-6 h-6 rounded-md bg-[var(--chip)] flex items-center justify-center text-[var(--green)] flex-shrink-0",
  fieldLabel: "block text-sm font-semibold mb-1.5",
  textInput:
    "w-full px-3 py-2.5 text-sm bg-[var(--field-bg)] border border-[var(--line)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--green)]/25 focus:border-[var(--green)]",
  selectWrapper: "relative mb-4",
  selectInput:
    "w-full appearance-none px-3 py-2.5 pr-9 text-sm bg-[var(--field-bg)] border border-[var(--line)] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--green)]/25 focus:border-[var(--green)]",
  selectChevron:
    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]",

  // Right column
  rightCol: "flex flex-col gap-4 min-w-0",

  addCard:
    "bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-sm p-4",
  addCardTitle: "text-base font-bold mb-1",
  addCardHint: "text-xs text-[var(--muted)] mb-3",
  addForm:
    "grid grid-cols-2 sm:grid-cols-[1fr_1fr_78px_1.2fr_auto] gap-2.5 items-end",
  formField: "flex flex-col gap-1",
  formLabel: "text-xs font-semibold text-[var(--muted)]",
  formInput:
    "w-full px-2.5 py-2 text-sm bg-[var(--field-bg)] border border-[var(--line)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]/25 focus:border-[var(--green)]",
  formInputCenter: "text-center",
  addButton:
    "px-4 h-[38px] text-sm font-bold text-white bg-[var(--green)] rounded-lg shadow-[0_2px_0_var(--green-d)] hover:brightness-105 whitespace-nowrap transition",

  dupeWarning:
    "flex items-center gap-2.5 px-3.5 py-2.5 bg-[var(--warn-bg)] border border-[var(--warn)] rounded-xl",
  dupeWarningText: "text-sm font-semibold text-[var(--warn)]",

  rosterCard:
    "bg-[var(--card)] border border-[var(--line)] rounded-2xl shadow-sm overflow-hidden",
  rosterHeader:
    "flex items-center justify-between px-4 py-3 border-b border-[var(--line)]",
  rosterTitle: "text-base font-bold",
  rosterCount:
    "text-xs font-semibold text-[var(--muted)] bg-[var(--chip)] px-2.5 py-1 rounded-full",

  emptyState: "px-5 py-10 text-center",
  emptyIcon:
    "w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--chip)] flex items-center justify-center text-[var(--green)]",
  emptyTitle: "text-sm font-semibold",
  emptySubtitle: "text-xs text-[var(--muted)] mt-1",

  rosterList: "list-none m-0 p-1.5",
  rosterRow: "flex items-center gap-3 px-3 py-2.5 rounded-xl",
  rosterRowDupe: "bg-[var(--warn-bg)] shadow-[inset_0_0_0_1px_var(--warn)]",
  numberBadge:
    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 bg-[var(--chip)]",
  rosterName: "text-sm font-semibold truncate",
  rosterSub: "text-xs text-[var(--muted)] mt-0.5",
  positionChip:
    "text-xs font-bold tracking-wide text-[var(--green)] bg-[var(--chip)] px-2.5 py-1 rounded-full flex-shrink-0",
  deleteButton:
    "w-8 h-8 flex items-center justify-center text-[var(--muted)] rounded-lg hover:bg-[var(--warn-bg)] hover:text-[var(--warn)] transition flex-shrink-0",

  toast:
    "fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-[var(--paper)] text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg z-50",
};
