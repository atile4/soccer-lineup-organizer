import { Formation, Division } from './types'

// TODO: CUSTOMIZATION POINT #1 - Modify formations and positions here
// You can add more formations or adjust the positions for each formation
// x: percentage from left (0-100), y: percentage from top (0-100)

export const FORMATIONS: Record<string, Formation> = {
  '1-3-3': {
    name: '1-3-3 (Goalkeeper + 3 Defenders + 3 Forwards)',
    positions: [
      // Goalkeeper
      { id: 'gk', x: 50, y: 85, label: 'GK' },
      // Defenders
      { id: 'lb', x: 20, y: 65, label: 'LB' },
      { id: 'cb', x: 50, y: 65, label: 'CB' },
      { id: 'rb', x: 80, y: 65, label: 'RB' },
      // Forwards
      { id: 'lf', x: 25, y: 30, label: 'LF' },
      { id: 'cf', x: 50, y: 25, label: 'CF' },
      { id: 'rf', x: 75, y: 30, label: 'RF' },
    ],
  },
  '1-2-1-2': {
    name: '1-2-1-2 (Goalkeeper + 2 Defenders + 1 Midfielder + 2 Forwards)',
    positions: [
      // Goalkeeper
      { id: 'gk', x: 50, y: 85, label: 'GK' },
      // Defenders
      { id: 'lb', x: 30, y: 65, label: 'LB' },
      { id: 'rb', x: 70, y: 65, label: 'RB' },
      // Midfielder
      { id: 'cm', x: 50, y: 45, label: 'CM' },
      // Forwards
      { id: 'lf', x: 35, y: 25, label: 'LF' },
      { id: 'rf', x: 65, y: 25, label: 'RF' },
    ],
  },
  '1-4-3-3': {
    name: '1-4-3-3 (Goalkeeper + 4 Defenders + 3 Midfielders + 3 Forwards)',
    positions: [
      // Goalkeeper
      { id: 'gk', x: 50, y: 90, label: 'GK' },
      // Defenders
      { id: 'lb', x: 15, y: 70, label: 'LB' },
      { id: 'lcb', x: 35, y: 75, label: 'LCB' },
      { id: 'rcb', x: 65, y: 75, label: 'RCB' },
      { id: 'rb', x: 85, y: 70, label: 'RB' },
      // Midfielders
      { id: 'lm', x: 25, y: 50, label: 'LM' },
      { id: 'cm', x: 50, y: 50, label: 'CM' },
      { id: 'rm', x: 75, y: 50, label: 'RM' },
      // Forwards
      { id: 'lw', x: 20, y: 25, label: 'LW' },
      { id: 'st', x: 50, y: 20, label: 'ST' },
      { id: 'rw', x: 80, y: 25, label: 'RW' },
    ],
  },
  '1-3-4-3': {
    name: '1-3-4-3 (Goalkeeper + 3 Defenders + 4 Midfielders + 3 Forwards)',
    positions: [
      // Goalkeeper
      { id: 'gk', x: 50, y: 90, label: 'GK' },
      // Defenders
      { id: 'lb', x: 20, y: 70, label: 'LB' },
      { id: 'cb', x: 50, y: 75, label: 'CB' },
      { id: 'rb', x: 80, y: 70, label: 'RB' },
      // Midfielders
      { id: 'lm', x: 20, y: 50, label: 'LM' },
      { id: 'lcm', x: 40, y: 50, label: 'LCM' },
      { id: 'rcm', x: 60, y: 50, label: 'RCM' },
      { id: 'rm', x: 80, y: 50, label: 'RM' },
      // Forwards
      { id: 'lw', x: 25, y: 25, label: 'LW' },
      { id: 'st', x: 50, y: 20, label: 'ST' },
      { id: 'rw', x: 75, y: 25, label: 'RW' },
    ],
  },
  '1-4-4-2': {
    name: '1-4-4-2 (Goalkeeper + 4 Defenders + 4 Midfielders + 2 Forwards)',
    positions: [
      // Goalkeeper
      { id: 'gk', x: 50, y: 90, label: 'GK' },
      // Defenders
      { id: 'lb', x: 15, y: 70, label: 'LB' },
      { id: 'lcb', x: 35, y: 75, label: 'LCB' },
      { id: 'rcb', x: 65, y: 75, label: 'RCB' },
      { id: 'rb', x: 85, y: 70, label: 'RB' },
      // Midfielders
      { id: 'lm', x: 20, y: 50, label: 'LM' },
      { id: 'lcm', x: 40, y: 50, label: 'LCM' },
      { id: 'rcm', x: 60, y: 50, label: 'RCM' },
      { id: 'rm', x: 80, y: 50, label: 'RM' },
      // Forwards
      { id: 'lst', x: 35, y: 25, label: 'LST' },
      { id: 'rst', x: 65, y: 25, label: 'RST' },
    ],
  },
}

// TODO: CUSTOMIZATION POINT #2 - Modify divisions here
// You can add, remove, or rename divisions
export const DIVISIONS: Division[] = ['U-8', 'U-10', 'U-12', 'U-14', 'U-16', 'U-18']

// TODO: CUSTOMIZATION POINT #3 - Adjust field dimensions per division
// Different divisions may require different field visual adjustments
export const getDivisionFieldHeight = (division: Division): string => {
  switch (division) {
    case 'U-8':
      return '400px' // Smaller field for younger players
    case 'U-10':
      return '450px'
    case 'U-12':
      return '500px'
    case 'U-14':
      return '550px'
    case 'U-16':
      return '600px'
    case 'U-18':
      return '600px'
    default:
      return '500px'
  }
}

// TODO: CUSTOMIZATION POINT #4 - Adjust available formations per division
// Some formations may not be suitable for younger divisions
export const getFormationsForDivision = (division: Division): string[] => {
  switch (division) {
    case 'U-8':
    case 'U-10':
      return ['1-3-3', '1-2-1-2'] // Simpler formations for younger players
    case 'U-12':
      return ['1-3-3', '1-2-1-2', '1-4-3-3']
    case 'U-14':
    case 'U-16':
    case 'U-18':
      return Object.keys(FORMATIONS) // All formations available
    default:
      return Object.keys(FORMATIONS)
  }
}
