import React, { useState } from "react";
import { sidebarStyles } from "./ManageTeamSidebar.styles";

interface ManageTeamSidebarProps {
  // Add props here
}

export const ManageTeamSidebar: React.FC<ManageTeamSidebarProps> = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"teams" | "lineup">("teams");

  return (
    <>
      {/* Open-sidebar arrow button (visible only when sidebar is collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={sidebarStyles.openButton}
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={sidebarStyles.openButtonIcon}
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

      {/* Collapsible Sidebar */}
      <aside
        className={`${sidebarStyles.sidebar} ${sidebarOpen ? sidebarStyles.sidebarOpen : sidebarStyles.sidebarClosed}`}
      >
        <div className={sidebarStyles.innerWrapper}>
          {/* Header row with title + close (X) button */}
          <div className={sidebarStyles.header}>
            <h2 className={sidebarStyles.title}>Menu</h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className={sidebarStyles.closeButton}
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={sidebarStyles.closeButtonIcon}
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

          {/* Navigation links */}
          <nav className={sidebarStyles.nav}>
            <button
              onClick={() => setActiveTab("teams")}
              className={`${sidebarStyles.navButton} ${
                activeTab === "teams"
                  ? sidebarStyles.navButtonActive
                  : sidebarStyles.navButtonInactive
              }`}
            >
              🏟️ Teams
            </button>
            <button
              onClick={() => setActiveTab("lineup")}
              className={`${sidebarStyles.navButton} ${
                activeTab === "lineup"
                  ? sidebarStyles.navButtonActive
                  : sidebarStyles.navButtonInactive
              }`}
            >
              📋 Lineup
            </button>
          </nav>

          {/* Extra section (placeholder) */}
          <div className={sidebarStyles.extraSection}>
            <p className={sidebarStyles.extraSectionText}>
              Add more sidebar content here.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ManageTeamSidebar;
