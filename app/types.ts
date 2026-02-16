export interface Player {
  id: string
  name: string
  number: number
  position?: string
}

export interface Team {
  id: string
  name: string
  players: Player[]
  division: Division
}

export type Division = 'U-8' | 'U-10' | 'U-12' | 'U-14' | 'U-16' | 'U-18'

export interface Formation {
  name: string
  positions: Position[]
}

export interface Position {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  label: string
  playerId?: string
}

export interface LineupState {
  formation: string
  division: Division
  positions: Position[]
}
