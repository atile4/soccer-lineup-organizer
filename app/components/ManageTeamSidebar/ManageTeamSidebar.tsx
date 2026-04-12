import React, { useState } from "react";

interface ManageTeamSidebarProps {
  // Add props here
}

export const ManageTeamSidebar: React.FC<ManageTeamSidebarProps> = ({}) => {
  /* ─── ADDED: Sidebar open/closed state ─────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"teams" | "lineup">("teams");

  return (
    <div className="manage-team-sidebar">
      {/* ─── ADDED: Flex wrapper to hold sidebar + main content side by side ─── */}
      <div className="flex">
        {/* ─── ADDED: Open-sidebar arrow button (visible only when sidebar is collapsed) ─── */}
        {/* Positioned fixed so it stays visible as you scroll; adjust top value to clear your header */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-0 z-40 bg-white border border-l-0 border-gray-300 rounded-r-lg p-2 shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            {/* Right-pointing chevron SVG — swap for any icon you prefer */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* ─── ADDED: Collapsible Sidebar ──────────────────────────────────────── */}
        {/* Animate width between w-72 (open) and w-0 (closed).                    */}
        {/* Change w-72 (18rem / 288px) to any width you want.                      */}
        <aside
          className={`
            ${sidebarOpen ? "w-72" : "w-0"}
            transition-all duration-300 ease-in-out
            overflow-hidden
            bg-white border-r border-gray-200 shadow-sm
            min-h-[calc(100vh-64px)]
            flex-shrink-0
          `}
        >
          {/* ─── ADDED: Inner wrapper — fixed width so content doesn't reflow during animation ─── */}
          <div className="w-72 p-4">
            {/* ─── ADDED: Sidebar header row with title + close (X) button ─── */}
            <div className="flex items-center justify-between mb-6">
              {/* Sidebar title — change to whatever you like */}
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>

              {/* Close (X) button — top-right of sidebar */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                {/* X icon SVG — swap for any icon you prefer */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ─── ADDED: Sidebar navigation links ────────────────────────────── */}
            {/* These use activeTab to highlight the current tab.                   */}
            {/* Add, remove, or restyle these buttons to fit your app.              */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("teams")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "teams"
                    ? "bg-green-100 text-green-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                🏟️ Teams
              </button>
              <button
                onClick={() => setActiveTab("lineup")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "lineup"
                    ? "bg-green-100 text-green-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📋 Lineup
              </button>
            </nav>

            {/* ─── ADDED: Sidebar extra section (placeholder) ─────────────────── */}
            {/* Use this space for filters, settings, team lists, etc.              */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Add more sidebar content here.
              </p>
            </div>
          </div>
          {/* ─── END: Sidebar inner wrapper ─── */}
        </aside>
        {/* ─── END: Collapsible Sidebar ─── */}

        {/* ─── MODIFIED: Main Content — now uses flex-1 to fill remaining width ─── */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"></main>
      </div>
      {/* ─── END: Flex wrapper ─── */}
    </div>
  );
};

export default ManageTeamSidebar;
