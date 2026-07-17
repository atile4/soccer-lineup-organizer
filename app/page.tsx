"use client";

// hooks
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

// fetches
import { fetchCurrentIDs } from "@/services/profiles";

// Components
import AppHeader from "./components/AppHeader/AppHeader";
import ManageTeamSidebar from "./components/ManageTeamSidebar/ManageTeamSidebar";
import PlayerSidebar from "./components/PlayerSidebar/PlayerSidebar";
import Bench from "./components/Bench/Bench";

type CurrentIds = {
  current_team_id: string | null;
  current_game_id: string | null;
};

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const { currentTeamId } = useTeam();
  const [currentIDs, setCurrentIDs] = useState<CurrentIds | null>(null);

  useEffect(() => {
    if (session) {
      fetchCurrentIDs(session.user.id).then(setCurrentIDs);
    }
  }, [session]);

  useEffect(() => {});

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex overflow-hidden py-4 gap-4">
        <ManageTeamSidebar teamId={currentTeamId} />

        {/* Soccer Field */}
        <div className="flex-1 flex items-center justify-center h-full w-full min-w-0 px-4">
          <div
            className="relative w-full"
            style={{
              maxWidth: "900px",
              maxHeight: "calc(100vh - 6rem)",
            }}
          >
            <img
              src="/images/soccer_field.png"
              alt="Soccer field"
              className="rounded-lg w-full h-auto object-contain"
              style={{ maxHeight: "calc(100vh - 6rem)" }}
            />
            {/* Future: drag-and-drop player components will be layered here */}
          </div>
        </div>
        <Bench />
        <PlayerSidebar teamId={currentTeamId} />
      </main>
    </div>
  );
}
