export const playerSidebarStyles = {
  // Arrow button visible when sidebar is collapsed (desktop only — mobile uses
  // the toolbar toggle in page.tsx).
  openButton:
    "hidden lg:block fixed top-20 right-0 z-40 bg-[#fefcf3] border border-r-0 border-[#e8e0c8] rounded-l-lg p-2 shadow-md hover:bg-[#f5edd4] transition-colors",
  openButtonIcon: "h-5 w-5 text-gray-600",

  // Backdrop behind the mobile drawer (below lg only).
  backdrop: "fixed inset-0 z-40 bg-black/40 lg:hidden",

  // Below lg: off-canvas drawer sliding in from the right over a backdrop.
  // At lg+: the original in-flow collapsible column (width toggles between
  // sidebarOpen / sidebarClosed), rendering identically to before.
  sidebar:
    "fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm rounded-l-lg shadow-xl transition-transform duration-300 ease-in-out overflow-hidden overflow-y-auto bg-[#fefcf3] border border-[#e8e0c8] lg:static lg:inset-auto lg:z-auto lg:h-full lg:max-w-none lg:shadow-sm lg:flex-shrink-0 lg:translate-x-0 lg:transition-[width]",
  sidebarOpen: "translate-x-0 lg:w-80",
  sidebarClosed: "translate-x-full lg:w-0",

  // Fixed-width wrapper — prevents content from reflowing during animation
  innerWrapper: "w-full min-w-72 p-4 flex h-full flex-col",

  // Header row
  header: "relative flex items-center justify-center mb-2",
  title: "text-xl font-bold text-gray-800",
  closeButton:
    "absolute left-0 p-1 rounded-md hover:bg-gray-100 transition-colors",
  closeButtonIcon: "h-5 w-5 text-gray-500",

  // Player List
playerList: "w-full flex-1 min-h-0 bg-[#fefcf3] px-4 pt-2 pb-0 flex flex-col overflow-y-auto max-h-[87%]",

  // Bench All Players Button
  sendAllButton: "mt-auto mb-1 w-2/3 mx-auto rounded-md bg-[#318e2a] px-4 py-1 text-white font-semibold shadow-sm hover:bg-[#2d7b26] transition-colors"
};
