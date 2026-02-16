# Soccer Lineup Organizer

A modern Next.js application for soccer coaches to create and manage team lineups with an intuitive drag-and-drop interface.

## Features

- 🔐 Guest login (ready for authentication integration)
- 👥 Team management - Create and manage multiple teams
- 🎽 Player management - Add players with names and numbers
- ⚽ Lineup creator - Visual drag-and-drop lineup builder
- 📊 Multiple formations (1-3-3, 1-2-1-2, 1-4-3-3, 1-3-4-3, 1-4-4-2)
- 🏆 Division support (U-8, U-10, U-12, U-14, U-16, U-18)
- 💾 Local storage persistence
- 📱 Fully responsive design
- 🎨 Modern, clean UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

The static export will be in the `out/` directory, ready to deploy to AWS Amplify or any static hosting service.

## Authentication Integration

The app currently uses guest login. Here are the authentication integration points and recommended services:

### Authentication Points in Code

#### 1. Login Page (`app/page.tsx`)
- **Line 10-17**: `handleGuestLogin()` function - Replace with actual authentication
- **Line 40-50**: Login form section - Add email/password fields
- **Line 60-65**: Social login buttons section - Add OAuth providers

#### 2. Dashboard (`app/dashboard/page.tsx`)
- **Line 132-143**: User menu in header - Add user profile and logout functionality

### Recommended Authentication Services

#### 1. **NextAuth.js (Auth.js)** - RECOMMENDED
- **Why**: Most popular, free, works seamlessly with Next.js
- **Supports**: Email/password, Google, GitHub, Facebook, and 50+ providers
- **Setup**:
  ```bash
  npm install next-auth
  ```
- **Docs**: https://next-auth.js.org/

#### 2. **Clerk**
- **Why**: Complete authentication UI components, easy setup
- **Supports**: Email, social logins, phone, passkeys
- **Setup**:
  ```bash
  npm install @clerk/nextjs
  ```
- **Docs**: https://clerk.com/docs

#### 3. **Auth0**
- **Why**: Enterprise-grade, highly secure
- **Supports**: All major providers, MFA, enterprise SSO
- **Setup**:
  ```bash
  npm install @auth0/nextjs-auth0
  ```
- **Docs**: https://auth0.com/docs/quickstart/webapp/nextjs

#### 4. **AWS Cognito**
- **Why**: Great if deploying to AWS, serverless
- **Supports**: Email, social, SAML
- **Setup**:
  ```bash
  npm install @aws-amplify/ui-react aws-amplify
  ```
- **Docs**: https://docs.amplify.aws/

#### 5. **Firebase Authentication**
- **Why**: Google's solution, real-time database included
- **Supports**: Email, Google, Apple, phone, anonymous
- **Setup**:
  ```bash
  npm install firebase
  ```
- **Docs**: https://firebase.google.com/docs/auth

#### 6. **Supabase Auth**
- **Why**: Open-source, includes database and storage
- **Supports**: Email, social, phone, magic links
- **Setup**:
  ```bash
  npm install @supabase/supabase-js @supabase/auth-ui-react
  ```
- **Docs**: https://supabase.com/docs/guides/auth

## Customization Points

### 1. Formations (`app/formations.ts`)
- **Line 6-86**: Modify existing formations or add new ones
- Adjust x/y coordinates (percentages) to change player positions
- Add new formation objects to `FORMATIONS` record

### 2. Divisions (`app/formations.ts`)
- **Line 89**: Add or remove divisions from the `DIVISIONS` array

### 3. Field Dimensions (`app/formations.ts`)
- **Line 93-105**: Adjust field height per division in `getDivisionFieldHeight()`

### 4. Formation Availability (`app/formations.ts`)
- **Line 109-122**: Control which formations are available for each division

### 5. Action Handlers (`app/dashboard/page.tsx`)
- **Line 85-102**: Implement reset, undo, redo, and save functionality
- Current implementations are placeholders with console logs

## Action Handler Implementation Guide

### Reset Lineup
Already implemented - clears all player positions.

### Undo/Redo
Implement history tracking:

```typescript
const [history, setHistory] = useState<Position[][]>([])
const [historyIndex, setHistoryIndex] = useState(-1)

// On every lineup change, add to history
const updateLineupWithHistory = (newPositions: Position[]) => {
  const newHistory = history.slice(0, historyIndex + 1)
  setHistory([...newHistory, newPositions])
  setHistoryIndex(newHistory.length)
  setLineupPositions(newPositions)
}

// Undo
const handleUndoAction = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1)
    setLineupPositions(history[historyIndex - 1])
  }
}

// Redo
const handleRedoAction = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1)
    setLineupPositions(history[historyIndex + 1])
  }
}
```

### Save Lineup
Options for saving:

1. **Export as JSON**:
```typescript
const handleSaveLineup = () => {
  const lineupData = {
    teamId: selectedTeam?.id,
    teamName: selectedTeam?.name,
    division,
    formation,
    positions: lineupPositions,
    timestamp: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(lineupData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lineup-${selectedTeam?.name}-${new Date().toISOString()}.json`
  a.click()
}
```

2. **Save to Database** (requires backend):
```typescript
const handleSaveLineup = async () => {
  const lineupData = {
    teamId: selectedTeam?.id,
    division,
    formation,
    positions: lineupPositions,
  }
  const response = await fetch('/api/lineups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lineupData),
  })
}
```

3. **Export as Image** (requires html2canvas):
```bash
npm install html2canvas
```
```typescript
import html2canvas from 'html2canvas'

const handleSaveLineup = async () => {
  const fieldElement = document.getElementById('lineup-field')
  if (fieldElement) {
    const canvas = await html2canvas(fieldElement)
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `lineup-${selectedTeam?.name}.png`
    a.click()
  }
}
```

## Deployment to AWS Amplify

1. Build the project:
   ```bash
   npm run build
   ```

2. The `out/` directory contains your static site with `index.html` at the root

3. Go to AWS Amplify Console

4. Choose "Host web app" > "Deploy without Git provider"

5. Drag and drop the entire `out/` folder

6. Your app will be live in minutes!

## Project Structure

```
soccer-lineup-organizer/
├── app/
│   ├── components/
│   │   ├── TeamManager.tsx      # Team and player management
│   │   ├── LineupCreator.tsx    # Visual field with drag-drop
│   │   └── PlayerList.tsx       # Draggable player list
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard page
│   ├── formations.ts             # Formation configurations
│   ├── types.ts                  # TypeScript interfaces
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Login page
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HTML5 Drag and Drop API** - Player positioning
- **Local Storage** - Data persistence

## License

MIT

## Support

For questions or issues, please open an issue on the repository.
