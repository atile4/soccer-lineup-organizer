export const benchStyles = {
  wrapper: "flex flex-shrink-0 self-stretch",

  benchArea:
    "h-full bg-gray-300/90 border border-gray-400/60 rounded-r-lg shadow-inner overflow-hidden flex flex-col transition-[width] duration-300 ease-in-out",
  benchAreaOpen: "w-28",
  benchAreaClosed: "w-0 border-0 shadow-none",

  innerWrapper: "w-28 h-full flex flex-col p-2 min-w-28",

  title:
    "text-[11px] font-bold uppercase tracking-wide text-gray-600 text-center mb-2 flex-shrink-0",

  list: "flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5",

  emptyText: "text-[11px] text-gray-500 text-center mt-2 px-1",

  gripButton:
    "self-center -mr-3 z-10 flex-shrink-0 w-6 h-14 rounded-md bg-gray-400 hover:bg-gray-500 border border-gray-500/50 shadow flex items-center justify-center transition-colors",
  gripIcon: "h-4 w-4 text-white",
};
