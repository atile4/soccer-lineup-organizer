"use client";

import { useState, useEffect } from "react";
import { Player, Team, Division, Position } from "./types";
import {
  FORMATIONS,
  DIVISIONS,
  getDivisionFieldHeight,
  getFormationsForDivision,
} from "./formations";

// Components
import TeamManager from "./components/TeamManager";
import LineupCreator from "./components/LineupCreator";
import PlayerList from "./components/PlayerList";
import AppHeader from "./components/AppHeader/AppHeader";
import ManageTeamSidebar from "./components/ManageTeamSidebar/ManageTeamSidebar";
import PlayerSidebar from "./components/PlayerSidebar/PlayerSidebar";

export default function DashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [division, setDivision] = useState<Division>("U-12");
  const [formation, setFormation] = useState<string>("1-3-3");
  const [lineupPositions, setLineupPositions] = useState<Position[]>([]);

  // Initialize lineup positions when formation or division changes
  useEffect(() => {
    if (FORMATIONS[formation]) {
      setLineupPositions(
        FORMATIONS[formation].positions.map((pos) => ({
          ...pos,
          playerId: undefined,
        })),
      );
    }
  }, [formation, division]);

  // Load data from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem("soccer-teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  // Save teams to localStorage
  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem("soccer-teams", JSON.stringify(teams));
    }
  }, [teams]);

  const handleAddTeam = (teamName: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      players: [],
      division: division,
    };
    setTeams([...teams, newTeam]);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((t) => t.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const handleAddPlayer = (
    teamId: string,
    playerName: string,
    playerNumber: number,
  ) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          const newPlayer: Player = {
            id: Date.now().toString(),
            name: playerName,
            number: playerNumber,
          };
          return { ...team, players: [...team.players, newPlayer] };
        }
        return team;
      }),
    );
  };

  const handleDeletePlayer = (teamId: string, playerId: string) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            players: team.players.filter((p) => p.id !== playerId),
          };
        }
        return team;
      }),
    );

    // Remove player from lineup if they were placed
    setLineupPositions(
      lineupPositions.map((pos) =>
        pos.playerId === playerId ? { ...pos, playerId: undefined } : pos,
      ),
    );
  };

  const handlePlayerDrop = (positionId: string, playerId: string) => {
    setLineupPositions(
      lineupPositions.map((pos) =>
        pos.id === positionId ? { ...pos, playerId } : pos,
      ),
    );
  };

  const handleRemovePlayerFromPosition = (positionId: string) => {
    setLineupPositions(
      lineupPositions.map((pos) =>
        pos.id === positionId ? { ...pos, playerId: undefined } : pos,
      ),
    );
  };

  // TODO: ACTION HANDLERS - Implement these functions
  const handleResetLineup = () => {
    // TODO: Reset all positions to empty
    setLineupPositions(
      lineupPositions.map((pos) => ({ ...pos, playerId: undefined })),
    );
    console.log("Reset lineup - Implement your reset logic here");
  };

  const handleUndoAction = () => {
    // TODO: Implement undo functionality
    // You can maintain a history stack of lineup states
    console.log("Undo action - Implement your undo logic here");
  };

  const handleRedoAction = () => {
    // TODO: Implement redo functionality
    // You can maintain a history stack of lineup states
    console.log("Redo action - Implement your redo logic here");
  };

  const handleSaveLineup = () => {
    // TODO: Implement save functionality
    // You can save to localStorage, database, or export as PDF/image
    const lineupData = {
      teamId: selectedTeam?.id,
      teamName: selectedTeam?.name,
      division,
      formation,
      positions: lineupPositions,
      timestamp: new Date().toISOString(),
    };
    console.log("Save lineup - Implement your save logic here", lineupData);
    alert("Lineup saved! (Implement your save logic in handleSaveLineup)");
  };

  // TODO: AUTHENTICATION POINT #4 - Add logout functionality
  const handleLogout = () => {
    // TODO: Implement logout logic here
    // Example: signOut() from your auth provider
    console.log("Logout clicked - Implement your logout logic here");
    // For now, just redirect to home
    // router.push('/')
  };

  return (
    <div className="h-screen flex flex-col">
      <AppHeader userName="Guest User" onLogout={handleLogout} />

      <main className="flex-1 flex overflow-hidden py-4 gap-4">
        <ManageTeamSidebar />

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
        <PlayerSidebar />
      </main>
    </div>
  );
}
