export const sidebarStyles = {
  openButton:
    "fixed top-20 left-0 z-40 bg-white border border-l-0 border-gray-300 rounded-r-lg p-2 shadow-md hover:bg-gray-100 transition-colors",
  openButtonIcon: "h-5 w-5 text-gray-600",

  sidebar:
    "transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 shadow-sm min-h-[calc(100vh-64px)] flex-shrink-0",
  sidebarOpen: "w-72",
  sidebarClosed: "w-0",

  innerWrapper: "w-72 p-4",

  header: "flex items-center justify-between mb-6",
  title: "text-lg font-semibold text-gray-800",

  closeButton: "p-1 rounded-md hover:bg-gray-100 transition-colors",
  closeButtonIcon: "h-5 w-5 text-gray-500",

  nav: "space-y-1",
  navButton: "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
  navButtonActive: "bg-green-100 text-green-800 font-medium",
  navButtonInactive: "text-gray-600 hover:bg-gray-100",

  extraSection: "mt-6 pt-6 border-t border-gray-200",
  extraSectionText: "text-xs text-gray-400",
};
