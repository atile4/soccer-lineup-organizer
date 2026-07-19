export const lineupTabsStyles = {
  // Vertical stack of tabs. self-start keeps it justified to the top of the
  // field rather than stretching the field's full height; flex-shrink-0 keeps
  // the tabs from being squeezed on narrow viewports.
  container: "flex flex-col gap-2 flex-shrink-0 self-start",

  tab: "w-12 h-12 rounded-lg border text-sm font-semibold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-300",
  tabActive: "bg-green-600 text-white border-green-600 shadow-sm",
  tabInactive: "bg-[#fefcf3] text-gray-700 border-[#e8e0c8] hover:bg-[#f5edd4]",
};
