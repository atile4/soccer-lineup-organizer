'use client'

import { Player, Position } from '../types'

interface PlayerListProps {
  players: Player[]
  lineupPositions: Position[]
}

export default function PlayerList({ players, lineupPositions }: PlayerListProps) {
  const getAvailablePlayers = () => {
    const assignedPlayerIds = lineupPositions
      .filter(pos => pos.playerId)
      .map(pos => pos.playerId)
    
    return players.filter(player => !assignedPlayerIds.includes(player.id))
  }

  const getAssignedPlayers = () => {
    const assignedPlayerIds = lineupPositions
      .filter(pos => pos.playerId)
      .map(pos => pos.playerId)
    
    return players.filter(player => assignedPlayerIds.includes(player.id))
  }

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('playerId', player.id)
  }

  const availablePlayers = getAvailablePlayers()
  const assignedPlayers = getAssignedPlayers()

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Players</h3>
        <p className="text-sm text-gray-500 mt-1">
          {availablePlayers.length} of {players.length} available
        </p>
      </div>

      {/* Available Players */}
      {availablePlayers.length > 0 ? (
        <div className="space-y-2 mb-6">
          {availablePlayers.map(player => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => handleDragStart(e, player)}
              className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move transition-colors border-2 border-transparent hover:border-primary"
            >
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                {player.number}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{player.name}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500">All players assigned!</p>
        </div>
      )}

      {/* Assigned Players */}
      {assignedPlayers.length > 0 && (
        <>
          <div className="border-t border-gray-200 pt-4 mb-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">In Lineup</h4>
          </div>
          <div className="space-y-2">
            {assignedPlayers.map(player => {
              const position = lineupPositions.find(pos => pos.playerId === player.id)
              return (
                <div
                  key={player.id}
                  className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {player.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{player.name}</div>
                    {position && (
                      <div className="text-xs text-gray-500">{position.label}</div>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
