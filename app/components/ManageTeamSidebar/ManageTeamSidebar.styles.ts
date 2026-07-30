export const sidebarStyles = {
  // Arrow button visible when sidebar is collapsed (desktop only — mobile uses
  // the toolbar toggle in page.tsx).
  openButton:
    "hidden lg:block fixed top-20 left-0 z-40 bg-[#fefcf3] border border-l-0 border-[#e8e0c8] rounded-r-lg p-2 shadow-md hover:bg-[#f5edd4] transition-colors",
  openButtonIcon: "h-5 w-5 text-gray-600",

  // Backdrop behind the mobile drawer (below lg only).
  backdrop: "fixed inset-0 z-40 bg-black/40 lg:hidden",

  // Below lg: off-canvas drawer sliding in from the left over a backdrop.
  // At lg+: the original in-flow collapsible column (width toggles between
  // sidebarOpen / sidebarClosed), rendering identically to before.
  sidebar:
    "fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm rounded-r-lg shadow-xl transition-transform duration-300 ease-in-out overflow-hidden overflow-y-auto bg-[#fefcf3] border border-[#e8e0c8] lg:static lg:inset-auto lg:z-auto lg:h-full lg:max-w-none lg:shadow-sm lg:flex-shrink-0 lg:translate-x-0 lg:transition-[width]",
  sidebarOpen: "translate-x-0 lg:w-80",
  sidebarClosed: "-translate-x-full lg:w-0",

  // Fixed-width wrapper — prevents content from reflowing during animation
  innerWrapper: "w-full min-w-72 p-4",

  // Header row
  header: "flex items-center justify-between mb-6",
  title: "text-xl font-bold text-gray-800",
  closeButton: "p-1 rounded-md hover:bg-gray-100 transition-colors",
  closeButtonIcon: "h-5 w-5 text-gray-500",

  // Fields section
  manageSection: "mt-6 pt-6 border-t border-gray-200 space-y-5",
  fieldGroup: "flex flex-col gap-1",
  sectionTitle: "text-lg font-semibold text-gray-800",
  selectWrapper: "relative",
  textInput:
    "w-full px-3 py-2 text-sm border border-[#e8e0c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400",
  selectInput:
    "w-full appearance-none bg-[#fefcf3] px-3 py-2 pr-10 text-sm border border-[#e8e0c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 cursor-pointer",
  customArrowIcon:
    "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500",
  textArea:
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400",

  errorText: "text-xs text-red-600 mt-1",
  extraSectionText: "text-xs text-gray-400",

  // Create Game Button
  createGameButton:
    "mt-2 flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800",
  createGamePlus:
    "flex h-5 w-5 items-center justify-center rounded-full border-2 border-green-600 bg-transparent text-green-600",

  // Toasts
  toastSuccess:
    "fixed bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg z-50 bg-gray-900 text-white",
  toastError:
    "fixed bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg z-50 bg-red-600 text-white",
};
