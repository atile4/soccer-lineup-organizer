'use client'

import { useState } from 'react'
import { Team, Player } from '../types'

interface TeamManagerProps {
  teams: Team[]
  onAddTeam: (name: string) => void
  onDeleteTeam: (teamId: string) => void
  onAddPlayer: (teamId: string, name: string, number: number) => void
  onDeletePlayer: (teamId: string, playerId: string) => void
  selectedTeam: Team | null
  onSelectTeam: (team: Team) => void
}

export default function TeamManager({
  teams,
  onAddTeam,
  onDeleteTeam,
  onAddPlayer,
  onDeletePlayer,
  selectedTeam,
  onSelectTeam,
}: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerNumber, setNewPlayerNumber] = useState('')
  const [showAddTeam, setShowAddTeam] = useState(false)

  const handleSubmitTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTeamName.trim()) {
      onAddTeam(newTeamName.trim())
      setNewTeamName('')
      setShowAddTeam(false)
    }
  }

  const handleSubmitPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTeam && newPlayerName.trim() && newPlayerNumber) {
      onAddPlayer(selectedTeam.id, newPlayerName.trim(), parseInt(newPlayerNumber))
      setNewPlayerName('')
      setNewPlayerNumber('')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Teams List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Teams</h3>
          <button
            onClick={() => setShowAddTeam(!showAddTeam)}
            className="px-4 py-2 bg-primary hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Team</span>
          </button>
        </div>

        {showAddTeam && (
          <form onSubmit={handleSubmitTeam} className="mb-4 p-4 bg-green-50 rounded-lg">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTeam(false)
                  setNewTeamName('')
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500">No teams yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Team" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {teams.map(team => (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTeam?.id === team.id
                    ? 'border-primary bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{team.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {team.players.length} player{team.players.length !== 1 ? 's' : ''} • {team.division}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete team "${team.name}"?`)) {
                        onDeleteTeam(team.id)
                      }
                    }}
                    className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Players List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedTeam ? `${selectedTeam.name} - Players` : 'Select a team'}
        </h3>

        {selectedTeam ? (
          <>
            <form onSubmit={handleSubmitPlayer} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="number"
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                  placeholder="No."
                  min="0"
                  max="99"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Add Player
              </button>
            </form>

            {selectedTeam.players.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-500">No players yet</p>
                <p className="text-sm text-gray-400 mt-1">Add players to build your team</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedTeam.players.map(player => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {player.number}
                      </div>
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${player.name}?`)) {
                          onDeletePlayer(selectedTeam.id, player.id)
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-gray-500">No team selected</p>
            <p className="text-sm text-gray-400 mt-1">Select a team to manage players</p>
          </div>
        )}
      </div>
    </div>
  )
}
