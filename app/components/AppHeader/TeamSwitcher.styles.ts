export const teamSwitcherStyles = {
  wrapper: "relative inline-block",

  // Trigger button — shows the *current* team
  trigger:
    "flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left",

  swatch: "w-8 h-8 rounded-full border-2 border-white/70 flex-shrink-0",

  triggerText: "flex flex-col leading-tight min-w-0",
  triggerName: "text-sm font-semibold text-white truncate max-w-[10rem]",
  triggerMeta: "text-xs text-white/70 truncate max-w-[10rem]",

  chevron:
    "h-4 w-4 text-white/80 transition-transform duration-150 flex-shrink-0",
  chevronOpen: "rotate-180",

  // Empty state — shown when the user has no teams yet
  emptyTrigger:
    "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left",
  emptyIconWrap:
    "w-8 h-8 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center flex-shrink-0 text-white",
  emptyIcon: "h-4 w-4",
  emptyText: "text-sm font-semibold text-white",

  // Dropdown panel — lists every team with the same details
  dropdown:
    "absolute right-0 mt-2 w-72 rounded-lg shadow-xl border border-gray-200 bg-white z-50 py-1 max-h-80 overflow-y-auto",

  // Row wrapper — holds the select button and (for non-selected teams) a delete button
  optionRow: "group/row relative flex items-center hover:bg-gray-50 transition-colors",
  optionRowSelected: "bg-green-50 hover:bg-green-50",

  option: "flex-1 flex items-center gap-3 px-3 py-2.5 text-left min-w-0",

  optionText: "flex flex-col leading-tight min-w-0 flex-1",
  optionName: "text-sm font-semibold text-gray-900 truncate",
  optionMeta: "text-xs text-gray-500 truncate",

  checkIcon: "h-4 w-4 text-green-600 flex-shrink-0 mr-3",

  // Delete button — revealed on row hover, hidden for the active team
  deleteButton:
    "mr-2 flex-shrink-0 rounded-md p-1.5 text-gray-400 opacity-0 group-hover/row:opacity-100 focus:opacity-100 hover:bg-red-50 hover:text-red-600 transition-colors",
  deleteIcon: "h-4 w-4",

  // Divider + "Create team" row
  divider: "my-1 border-t border-gray-100",
  createOption:
    "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
  createIconWrap:
    "w-8 h-8 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center flex-shrink-0 text-green-600",
  createIcon: "h-4 w-4",
  createText: "text-sm font-semibold text-green-700",
};
