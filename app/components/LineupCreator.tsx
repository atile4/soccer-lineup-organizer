'use client'

import { useState } from 'react'
import { Position, Player, Division } from '../types'
import { getDivisionFieldHeight } from '../formations'

interface LineupCreatorProps {
  positions: Position[]
  players: Player[]
  division: Division
  onPlayerDrop: (positionId: string, playerId: string) => void
  onRemovePlayer: (positionId: string) => void
}

export default function LineupCreator({
  positions,
  players,
  division,
  onPlayerDrop,
  onRemovePlayer,
}: LineupCreatorProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  const [draggedFromPosition, setDraggedFromPosition] = useState<string | null>(null)

  const getPlayerForPosition = (position: Position): Player | undefined => {
    return players.find(p => p.id === position.playerId)
  }

  const handleDragStart = (player: Player, fromPositionId?: string) => {
    setDraggedPlayer(player)
    setDraggedFromPosition(fromPositionId || null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, positionId: string) => {
    e.preventDefault()
    if (draggedPlayer) {
      // If dragging from a position, clear that position first
      if (draggedFromPosition) {
        onRemovePlayer(draggedFromPosition)
      }
      onPlayerDrop(positionId, draggedPlayer.id)
      setDraggedPlayer(null)
      setDraggedFromPosition(null)
    }
  }

  const handleRemoveFromPosition = (positionId: string) => {
    onRemovePlayer(positionId)
  }

  const fieldHeight = getDivisionFieldHeight(division)

  return (
    <div className="relative">
      {/* Soccer Field */}
      <div
        className="relative bg-gradient-to-b from-green-500 to-green-600 rounded-lg overflow-hidden"
        style={{ height: fieldHeight }}
      >
        {/* Field Lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {/* Outer boundary */}
          <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          
          {/* Center line */}
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="white" strokeWidth="2" opacity="0.6" />
          
          {/* Center circle */}
          <circle cx="50%" cy="50%" r="8%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          <circle cx="50%" cy="50%" r="1%" fill="white" opacity="0.6" />
          
          {/* Penalty areas */}
          <rect x="35%" y="5%" width="30%" height="12%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          <rect x="35%" y="83%" width="30%" height="12%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          
          {/* Goal areas */}
          <rect x="42%" y="5%" width="16%" height="6%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          <rect x="42%" y="89%" width="16%" height="6%" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          
          {/* Goals */}
          <rect x="45%" y="3%" width="10%" height="2%" fill="white" opacity="0.4" />
          <rect x="45%" y="95%" width="10%" height="2%" fill="white" opacity="0.4" />
        </svg>

        {/* Position Markers */}
        {positions.map((position) => {
          const player = getPlayerForPosition(position)
          
          return (
            <div
              key={position.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, position.id)}
            >
              {player ? (
                // Player placed in position
                <div
                  draggable
                  onDragStart={() => handleDragStart(player, position.id)}
                  className="relative cursor-move group"
                >
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-primary group-hover:scale-110 transition-transform">
                    <div className="text-xs font-bold text-gray-500">{position.label}</div>
                    <div className="text-2xl font-bold text-primary">{player.number}</div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white px-2 py-1 rounded shadow text-xs font-semibold text-gray-900">
                      {player.name}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromPosition(position.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Empty position
                <div className="relative">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full border-2 border-white border-dashed flex items-center justify-center hover:bg-opacity-50 transition-colors">
                    <div className="text-xs font-bold text-white">{position.label}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">Drag and Drop Players</p>
            <p className="text-xs text-blue-700 mt-1">
              Drag players from the list on the left onto the field positions. You can also drag players between positions to rearrange them.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
