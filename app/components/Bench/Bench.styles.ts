export const benchStyles = {
  // Outer wrapper — width animates between open/closed, same pattern as
  // PlayerSidebar/ManageTeamSidebar so all three panels feel consistent
  wrapper:
    "transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 h-full flex flex-col",
  wrapperOpen: "w-48",
  wrapperClosed: "w-10",

  header: "flex items-center justify-between px-2 py-2",
  title: "text-sm font-bold text-gray-700",
  toggleButton: "p-1 rounded-md hover:bg-gray-200 transition-colors",
  toggleIcon: "h-4 w-4 text-gray-600",

  benchArea:
    "flex-1 min-h-0 overflow-y-auto bg-gray-200 rounded-xl border border-gray-300 shadow-inner p-2 space-y-2",

  emptyText: "text-xs text-gray-500 text-center mt-4",
};
