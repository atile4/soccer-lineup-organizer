export const sidebarStyles = {
  // Arrow button pinned to the left edge of the screen when sidebar is collapsed
  openButton:
    "fixed top-20 left-0 z-40 bg-white border border-l-0 border-gray-300 rounded-r-lg p-2 shadow-md hover:bg-gray-100 transition-colors",

  // Chevron icon inside the open button
  openButtonIcon: "h-5 w-5 text-gray-600",

  // The collapsible <aside> panel — width animates via sidebarOpen / sidebarClosed
  sidebar:
    "transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 shadow-sm min-h-[calc(100vh-64px)] flex-shrink-0",

  // Width when open (288px)
  sidebarOpen: "w-72",

  // Width when collapsed (0px, content hidden by overflow-hidden)
  sidebarClosed: "w-0",

  // Fixed-width wrapper inside <aside> — prevents content from reflowing during animation
  innerWrapper: "w-72 p-4",

  // Top row: title on the left, close button on the right
  header: "flex items-center justify-between mb-6",

  // "Menu" heading text
  title: "text-lg font-semibold text-gray-800",

  // X button that collapses the sidebar
  closeButton: "p-1 rounded-md hover:bg-gray-100 transition-colors",

  // X icon inside the close button
  closeButtonIcon: "h-5 w-5 text-gray-500",

  // Container for the nav buttons
  nav: "space-y-1",

  // Shared base styles for each nav button
  navButton: "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",

  // Currently selected tab
  navButtonActive: "bg-green-100 text-green-800 font-medium",

  // Non-selected tabs
  navButtonInactive: "text-gray-600 hover:bg-gray-100",

  // Placeholder section below the nav, separated by a top border
  extraSection: "mt-6 pt-6 border-t border-gray-200",

  // Subtle text inside the extra section
  extraSectionText: "text-xs text-gray-400",
};
