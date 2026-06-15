  // TODO: CUSTOMIZATION POINT - Popover Styles
  export const popoverStyles = {
    container: "absolute right-0 mt-2 w-64 rounded-xl shadow-xl border z-50",
    containerBg: "bg-white",
    containerBorder: "border-gray-200",

    // Header section
    header: "px-4 py-3 border-b",
    headerBorder: "border-gray-100",
    headerName: "font-semibold text-gray-900",
    headerEmail: "text-sm text-gray-500 mt-0.5",

    // Menu items
    menuItem:
      "flex items-center space-x-3 px-4 py-3 transition-colors cursor-pointer",
    menuItemHover: "hover:bg-gray-50",
    menuIcon: "w-5 h-5",
    menuIconColor: "text-gray-600",
    menuText: "text-sm font-medium text-gray-700",
    menuDescription: "text-xs text-gray-500 mt-0.5",

    // Logout item (special styling)
    logoutItem:
      "flex items-center space-x-3 px-4 py-3 border-t transition-colors cursor-pointer",
    logoutBorder: "border-gray-100",
    logoutHover: "hover:bg-red-50",
    logoutIcon: "w-5 h-5 text-red-600",
    logoutText: "text-sm font-medium text-red-600",
  };