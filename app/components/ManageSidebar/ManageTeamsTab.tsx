"use client";

import React from "react";
import { sidebarStyles } from "./ManageSidebar.styles";

// Managing teams @TODO implement editing team info
export const ManageTeamsTab: React.FC = () => {
  return (
    <div className={sidebarStyles.emptyState}>
      Team management is coming soon.
    </div>
  );
};

export default ManageTeamsTab;
