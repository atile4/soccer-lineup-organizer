export const popoverStyles = {
  container:
    "absolute right-0 mt-2 w-64 rounded-lg shadow-xl border border-gray-200 bg-white z-50",

  // Header section
  header: "px-4 py-3 border-b border-gray-100 flex items-center gap-3",
  headerName: "font-semibold text-gray-900",
  headerEmail: "text-sm text-gray-500 mt-0.5",

  // Menu items
  menuItem:
    "flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer",
  menuIcon: "w-5 h-5 text-gray-600",
  menuText: "text-sm font-medium text-gray-700",

  // Logout item
  logoutItem:
    "flex items-center space-x-3 px-4 py-3 border-t border-gray-100 hover:bg-red-50 transition-colors cursor-pointer",
  logoutIcon: "w-5 h-5 text-red-600",
  logoutText: "text-sm font-medium text-red-600",
};

  export const buttonStyles = {
    container:
      "flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors",
    avatar:
      "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-gradient-to-br from-primary to-green-600 text-white",
    userName: "text-sm font-medium text-gray-700",
    chevron: "w-4 h-4 text-gray-500 transition-transform",
  };