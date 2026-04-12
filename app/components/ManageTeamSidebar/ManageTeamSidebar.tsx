import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
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
          <ChevronRight className={sidebarStyles.openButtonIcon} />
        </button>
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`${sidebarStyles.sidebar} ${sidebarOpen ? sidebarStyles.sidebarOpen : sidebarStyles.sidebarClosed}`}
      >
        <div className={sidebarStyles.innerWrapper}>
          {/* Header row with title + close (X) button */}
          <div className={sidebarStyles.header}>
            <h1 className={sidebarStyles.title}>Manage Team</h1>

            <button
              onClick={() => setSidebarOpen(false)}
              className={sidebarStyles.closeButton}
              aria-label="Close sidebar"
            >
              <X className={sidebarStyles.closeButtonIcon} />
            </button>
          </div>
          {/* Put lineup dropdown here */}
          <p>Lineup Dropdown here</p>
          <div className={sidebarStyles.manageSection}>
            {/* Formation */}
            <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Formation:</h2>
              <input
                type="text"
                placeholder="e.g 1-4-5, 4-5, 4-1-3..."
                className={sidebarStyles.textInput}
              />
            </div>

            {/* Split by */}
            <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Split by:</h2>
            </div>

            {/* Notes */}
            <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Notes:</h2>
              <textarea
                placeholder="Add notes here..."
                className={sidebarStyles.textArea}
              />
            </div>

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
