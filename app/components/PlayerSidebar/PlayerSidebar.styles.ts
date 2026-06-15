export const playerSidebarStyles = {
  // Arrow button visible when sidebar is collapsed
  openButton:
    "fixed top-20 right-0 z-40 bg-white border border-r-0 border-gray-300 rounded-l-lg p-2 shadow-md hover:bg-gray-100 transition-colors",
  openButtonIcon: "h-5 w-5 text-gray-600",

  // Collapsible <aside> — width toggles between sidebarOpen / sidebarClosed
  // Height and spacing are controlled by the parent <main> in page.tsx
  sidebar:
    "transition-all duration-300 ease-in-out overflow-hidden overflow-y-auto bg-white border border-gray-200 rounded-l-lg shadow-sm flex-shrink-0 h-full",
  sidebarOpen: "w-80",
  sidebarClosed: "w-0",

  // Fixed-width wrapper — prevents content from reflowing during animation
  innerWrapper: "w-full min-w-72 p-4",

  // Header row
  header: "relative flex items-center justify-center mb-6",
  title: "text-xl font-bold text-gray-800",
  closeButton:
    "absolute left-0 p-1 rounded-md hover:bg-gray-100 transition-colors",
  closeButtonIcon: "h-5 w-5 text-gray-500",
};
