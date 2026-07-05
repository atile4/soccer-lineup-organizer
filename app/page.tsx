"use client";

// hooks
import { useAuth } from "@/context/AuthContext";

// Components
import AppHeader from "./components/AppHeader/AppHeader";
import ManageTeamSidebar from "./components/ManageTeamSidebar/ManageTeamSidebar";
import PlayerSidebar from "./components/PlayerSidebar/PlayerSidebar";

interface DashboardPageProps {
  teamId?: string;
}

export default function DashboardPage({
  teamId = "71908f3b-2a07-4007-bc94-1c7914517f4a",
}: DashboardPageProps) {
  // @TODO store a 'current team' column per user, and retrieve that team id for use in sidebar components
  //       something like a getCurrentId(userId)
  const { session, loading } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 flex overflow-hidden py-4 gap-4">
        <ManageTeamSidebar userId={session?.user.id} teamId={teamId} />

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
              className="rounded-lg shadow-lg w-full h-auto object-contain"
              style={{ maxHeight: "calc(100vh - 6rem)" }}
            />
            {/* Future: drag-and-drop player components will be layered here */}
          </div>
        </div>
        <PlayerSidebar teamId={teamId} />
      </main>
    </div>
  );
}
