export const benchStyles = {
  // Below lg: full-width strip below the field. At lg+: in-flow column beside it.
  wrapper: "flex w-full lg:w-auto flex-shrink-0 self-stretch",

  // Below lg: horizontal, full-width, auto-height bar. At lg+: the original
  // vertical column whose width animates open/closed.
  benchArea:
    "bg-gray-300/90 border border-gray-400/60 shadow-inner overflow-hidden flex flex-row lg:flex-col w-full lg:h-full rounded-lg lg:rounded-l-none transition-[width] duration-300 ease-in-out",
  benchAreaOpen: "lg:w-28",
  benchAreaClosed: "lg:w-0 lg:border-0 lg:shadow-none",

  innerWrapper:
    "w-full flex flex-row items-center gap-2 p-2 lg:flex-col lg:items-stretch lg:gap-0 lg:w-28 lg:min-w-28 lg:h-full",

  title:
    "text-[11px] font-bold uppercase tracking-wide text-gray-600 text-center flex-shrink-0 mb-0 mr-2 lg:mb-2 lg:mr-0",

  // Below lg: horizontal scrolling row. At lg+: vertical scrolling list.
  list: "flex flex-row gap-2 overflow-x-auto flex-1 min-h-0 pr-0.5 lg:flex-col lg:gap-0 lg:space-y-2 lg:overflow-x-visible lg:overflow-y-auto",

  emptyText:
    "text-[11px] text-gray-500 text-center whitespace-nowrap px-1 lg:mt-2",

  // Collapse grip — desktop only; the mobile bench stays open as a drop target.
  gripButton:
    "hidden lg:flex self-center -mr-3 z-10 flex-shrink-0 w-6 h-14 rounded-md bg-gray-400 hover:bg-gray-500 border border-gray-500/50 shadow items-center justify-center transition-colors",
  gripIcon: "h-4 w-4 text-white",
};
