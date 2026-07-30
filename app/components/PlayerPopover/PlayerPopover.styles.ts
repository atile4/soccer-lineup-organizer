export const playerInfoPopoverStyles = {
  overlay: "fixed inset-0 z-50",

  popover:
    "absolute w-64 rounded-xl border-4 border-gray-300 bg-gray-200 p-3.5 shadow-xl",

  // Toggled based on whether we've measured a position yet — avoids a
  // flash at (0,0) before useLayoutEffect runs. Split out from `popover`
  // so top/left (still inline, since they're computed at runtime) are the
  // only thing left in the style attribute.
  popoverVisible: "visible",
  popoverHidden: "invisible",

  headerRow: "flex items-start justify-between gap-2",

  identitySection: "min-w-0 flex-1",
  nameRow: "flex items-center gap-1.5",
  name: "text-xl font-semibold text-gray-900 truncate",
  positionRow: "mt-1 flex items-center gap-1.5",
  position: "text-base text-gray-600",

  editIconButton:
    "flex-shrink-0 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed",

  nameInput:
    "text-xl font-semibold text-gray-900 bg-white border border-gray-400 rounded-md px-1.5 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-green-300",
  positionInput:
    "text-base text-gray-600 bg-white border border-gray-400 rounded-md px-1.5 py-0.5 w-24 focus:outline-none focus:ring-2 focus:ring-green-300",

  errorText: "text-xs text-red-600 mt-1",

  deleteButton:
    "absolute bottom-2 right-2 text-gray-500 hover:text-red-600 cursor-pointer transition-colors",

  jerseyWrapper: "flex-shrink-0",

  jerseyPath: "stroke-[#1a1a1a] stroke-[3] [stroke-linejoin:round]",

  notesTextarea:
    "mt-3 w-full h-20 resize-none rounded-lg border border-gray-400 bg-white p-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none",
};
