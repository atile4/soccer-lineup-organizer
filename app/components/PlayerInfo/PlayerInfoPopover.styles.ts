// Styles for PlayerInfoPopover. Kept separate from the component so the
// JSX stays readable — same pattern as TeamBuilder.styles.ts.
export const playerInfoPopoverStyles = {
  overlay: "fixed inset-0 z-50",

  popover:
    "absolute w-64 rounded-xl border-4 border-gray-300 bg-gray-200 p-3.5 shadow-xl",

  headerRow: "flex items-start justify-between gap-2",

  // Name + position column (left side)
  identitySection: "min-w-0 flex-1",
  nameRow: "flex items-center gap-1.5",
  name: "text-xl font-semibold text-gray-900 truncate",
  positionRow: "mt-1 flex items-center gap-1.5",
  position: "text-base text-gray-600",

  // Shared look for both pencil icons — inert for now (no edit handler yet)
  editIconButton: "flex-shrink-0 text-gray-500 cursor-default",

  // Jersey badge (right side)
  jerseyWrapper: "flex-shrink-0",

  notesTextarea:
    "mt-3 w-full h-20 resize-none rounded-lg border border-gray-400 bg-white p-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none",
};
