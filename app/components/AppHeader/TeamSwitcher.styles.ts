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

  // Dropdown panel — lists every team with the same details
  dropdown:
    "absolute right-0 mt-2 w-72 rounded-lg shadow-xl border border-gray-200 bg-white z-50 py-1 max-h-80 overflow-y-auto",

  option:
    "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
  optionSelected: "bg-green-50",

  optionText: "flex flex-col leading-tight min-w-0 flex-1",
  optionName: "text-sm font-semibold text-gray-900 truncate",
  optionMeta: "text-xs text-gray-500 truncate",

  checkIcon: "h-4 w-4 text-green-600 flex-shrink-0",
};
