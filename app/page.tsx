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

export default function DashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [division, setDivision] = useState<Division>("U-12");
  const [formation, setFormation] = useState<string>("1-3-3");
  const [lineupPositions, setLineupPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState<"teams" | "lineup">("teams");

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      {/* Header - Now using AppHeader component */}
      <AppHeader userName="Guest User" onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("teams")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "teams"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>Team Manager</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("lineup")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "lineup"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                  <span>Lineup Creator</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
