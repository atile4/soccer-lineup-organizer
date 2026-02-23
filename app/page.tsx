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

        {/* Tab Content */}
        {activeTab === "teams" && (
          <TeamManager
            teams={teams}
            onAddTeam={handleAddTeam}
            onDeleteTeam={handleDeleteTeam}
            onAddPlayer={handleAddPlayer}
            onDeletePlayer={handleDeletePlayer}
            selectedTeam={selectedTeam}
            onSelectTeam={setSelectedTeam}
          />
        )}

        {activeTab === "lineup" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Team Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Team
                </h3>
                <select
                  value={selectedTeam?.id || ""}
                  onChange={(e) => {
                    const team = teams.find((t) => t.id === e.target.value);
                    setSelectedTeam(team || null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Division
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {DIVISIONS.map((div) => (
                    <button
                      key={div}
                      onClick={() => setDivision(div)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        division === div
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formation Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Formation
                </h3>
                <div className="space-y-2">
                  {getFormationsForDivision(division).map((formKey) => (
                    <button
                      key={formKey}
                      onClick={() => setFormation(formKey)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        formation === formKey
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-semibold">{formKey}</div>
                      <div
                        className={`text-sm ${formation === formKey ? "text-green-100" : "text-gray-500"}`}
                      >
                        {FORMATIONS[formKey].name
                          .split("(")[1]
                          ?.replace(")", "")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Player List */}
              {selectedTeam && (
                <PlayerList
                  players={selectedTeam.players}
                  lineupPositions={lineupPositions}
                />
              )}
            </div>

            {/* Main Area - Lineup Field */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTeam
                      ? selectedTeam.name
                      : "Select a team to begin"}
                  </h3>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResetLineup}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                      title="Reset lineup"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span className="text-sm font-medium">Reset</span>
                    </button>

                    <button
                      onClick={handleUndoAction}
                      className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Undo"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={handleRedoAction}
                      className="px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Redo"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={handleSaveLineup}
                      className="px-4 py-2 bg-primary hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      <span className="text-sm font-medium">Save</span>
                    </button>
                  </div>
                </div>

                <LineupCreator
                  positions={lineupPositions}
                  players={selectedTeam?.players || []}
                  division={division}
                  onPlayerDrop={handlePlayerDrop}
                  onRemovePlayer={handleRemovePlayerFromPosition}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
