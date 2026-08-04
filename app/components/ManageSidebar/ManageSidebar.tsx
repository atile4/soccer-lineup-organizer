import React, { useState } from "react";
import { CalendarDays, ChevronRight, Users, X } from "lucide-react";
import { sidebarStyles } from "./ManageSidebar.styles";

import ManageGamesTab from "./ManageGamesTab";
import ManageTeamsTab from "./ManageTeamsTab";

interface ManageSidebarProps {
  teamId: string | null;
  maxPlayers?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDesktop: boolean;
}

type ManageTab = "games" | "teams";

const TABS: { id: ManageTab; label: string; Icon: typeof CalendarDays }[] = [
  { id: "games", label: "Games", Icon: CalendarDays },
  { id: "teams", label: "Teams", Icon: Users },
];

// Sidebar shell
export const ManageSidebar: React.FC<ManageSidebarProps> = ({
  teamId,
  open: sidebarOpen,
  onOpenChange: setSidebarOpen,
  isDesktop,
}) => {
  const [activeTab, setActiveTab] = useState<ManageTab>("games");

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

      {/* Backdrop — closes the drawer on tap (mobile only) */}
      {sidebarOpen && !isDesktop && (
        <div
          className={sidebarStyles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Collapsible sidebar (desktop column) / off-canvas drawer (mobile) */}
      <aside
        className={`${sidebarStyles.sidebar} ${sidebarOpen ? sidebarStyles.sidebarOpen : sidebarStyles.sidebarClosed}`}
      >
        <div className={sidebarStyles.innerWrapper}>
          {/* Header row — tab switcher with the close (X) button */}
          <div className={sidebarStyles.header}>
            <div className={sidebarStyles.tabList} role="tablist">
              {TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id)}
                    className={`${sidebarStyles.tabButton} ${
                      isActive
                        ? sidebarStyles.tabButtonActive
                        : sidebarStyles.tabButtonInactive
                    }`}
                  >
                    <Icon
                      className={sidebarStyles.tabIcon}
                      aria-hidden="true"
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className={sidebarStyles.closeButton}
              aria-label="Close sidebar"
            >
              <X className={sidebarStyles.closeButtonIcon} />
            </button>
          </div>

          {/* Active tab content */}
          {activeTab === "games" ? (
            <ManageGamesTab teamId={teamId} />
          ) : (
            <ManageTeamsTab />
          )}
        </div>
      </aside>
    </>
  );
};

export default ManageSidebar;
