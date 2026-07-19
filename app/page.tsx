"use client";

// hooks
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";

// drag-and-drop
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// context
import { LineupProvider } from "@/context/LineupContext";

// fetches
import { fetchCurrentIDs } from "@/services/profiles";

// Components
import AppHeader from "./components/AppHeader/AppHeader";
import ManageTeamSidebar from "./components/ManageTeamSidebar/ManageTeamSidebar";
import PlayerSidebar from "./components/PlayerSidebar/PlayerSidebar";
import Bench from "./components/Bench/Bench";
import { Field } from "./components/Field/Field";
import LineupTabs from "./components/LineupTabs/LineupTabs";

type CurrentIds = {
  current_team_id: string | null;
  current_game_id: string | null;
};

export default function DashboardPage() {
  const { session } = useAuth();
  const { currentTeamId } = useTeam();
  const [currentIDs, setCurrentIDs] = useState<CurrentIds | null>(null);

  useEffect(() => {
    if (session) {
      fetchCurrentIDs(session.user.id).then(setCurrentIDs);
    }
  }, [session]);

  // @TODO gameId comes from the user's current game. Once lineup switching
  //       exists, the active lineup/period should drive placements too.
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <DndProvider backend={HTML5Backend}>
        <LineupProvider
          teamId={currentTeamId}
          gameId={currentIDs?.current_game_id ?? null}
        >
          <main className="flex-1 flex overflow-hidden py-4 gap-4">
            <ManageTeamSidebar teamId={currentTeamId} />

            {/* Soccer Field */}
            <div className="flex-1 flex items-center justify-center h-full w-full min-w-0 px-4">
              <div className="flex items-start gap-4">
                {/* Lineup period tabs — top-aligned to the left of the field */}
                <LineupTabs />

                <div className="flex items-start gap-4">
                  <Field />
                  <Bench />
                </div>
              </div>
            </div>

            <PlayerSidebar teamId={currentTeamId} />
          </main>
        </LineupProvider>
      </DndProvider>
    </div>
  );
}
