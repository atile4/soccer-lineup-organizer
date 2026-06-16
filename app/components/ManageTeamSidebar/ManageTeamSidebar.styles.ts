export const sidebarStyles = {
  // Arrow button visible when sidebar is collapsed
  openButton:
    "fixed top-20 left-0 z-40 bg-white border border-l-0 border-gray-300 rounded-r-lg p-2 shadow-md hover:bg-gray-100 transition-colors",
  openButtonIcon: "h-5 w-5 text-gray-600",

  // Collapsible <aside> — width toggles between sidebarOpen / sidebarClosed
  // Height and spacing are controlled by the parent <main> in page.tsx
  sidebar:
    "transition-all duration-300 ease-in-out overflow-hidden overflow-y-auto bg-white border border-gray-200 rounded-r-lg shadow-sm flex-shrink-0 h-full",
  sidebarOpen: "w-80",
  sidebarClosed: "w-0",

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
  textInput:
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400",
  textArea:
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400",

  errorText: "text-xs text-red-600 mt-1",
  extraSectionText: "text-xs text-gray-400",
};
