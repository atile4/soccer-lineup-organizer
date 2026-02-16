# Quick Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation Steps

### 1. Extract the Project

If you received a zip file, extract it to your desired location.

### 2. Open Terminal/Command Prompt

Navigate to the project directory:
```bash
cd soccer-lineup-organizer
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, TypeScript, etc.)

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 5. Build for Production

```bash
npm run build
```

The static export will be in the `out/` directory.

## What You Get

✅ Modern, responsive soccer lineup organizer
✅ Team management system
✅ Player management with jersey numbers
✅ Visual lineup creator with drag-and-drop
✅ Multiple formations (1-3-3, 1-2-1-2, 1-4-3-3, 1-3-4-3, 1-4-4-2)
✅ Division support (U-8 through U-18)
✅ Local storage persistence
✅ Guest login (ready for auth integration)

## Next Steps

### Add Authentication

See `AUTHENTICATION_GUIDE.md` for detailed implementation guides for:
- NextAuth.js (recommended)
- Clerk
- Auth0
- AWS Cognito
- Firebase
- Supabase

### Customize the App

See `README.md` section "Customization Points" for how to:
- Modify formations and positions
- Adjust divisions
- Change field dimensions
- Control formation availability by age group

### Deploy to Production

See `DEPLOYMENT_INSTRUCTIONS.md` for:
- AWS Amplify deployment (drag and drop)
- Vercel deployment
- Netlify deployment
- Other hosting options

## Project Structure

```
soccer-lineup-organizer/
├── app/
│   ├── components/         # React components
│   │   ├── TeamManager.tsx
│   │   ├── LineupCreator.tsx
│   │   └── PlayerList.tsx
│   ├── dashboard/          # Dashboard page
│   │   └── page.tsx
│   ├── formations.ts       # Formation configurations
│   ├── types.ts            # TypeScript types
│   ├── page.tsx            # Login page
│   └── layout.tsx          # Root layout
├── public/                 # Static assets
├── README.md              # Main documentation
├── AUTHENTICATION_GUIDE.md # Auth implementation guides
├── DEPLOYMENT_INSTRUCTIONS.md # Deployment guides
├── SETUP_GUIDE.md         # This file
└── package.json           # Dependencies and scripts
```

## Common Commands

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production (creates out/ folder)
npm start            # Run production server (not for static export)

# Code Quality
npm run lint         # Run ESLint (if configured)
```

## Key Features Explained

### Team Manager Tab
- Create multiple teams
- Add players with names and jersey numbers
- Manage team rosters
- Delete teams or players

### Lineup Creator Tab
1. Select a team from the dropdown
2. Choose division (U-8 through U-18)
3. Pick a formation
4. Drag players from the list onto field positions
5. Rearrange by dragging between positions
6. Remove players by clicking the X button
7. Use Reset, Undo, Redo, and Save buttons (customize in code)

### Field Visualization
- Dynamic field size based on division
- Realistic soccer field markings
- Position labels (GK, CB, LW, etc.)
- Player numbers and names displayed
- Responsive design for all screen sizes

## Customization Points in Code

### 1. Formations (`app/formations.ts`)
```typescript
// Add new formation
'1-2-3-1': {
  name: '1-2-3-1 (Custom Formation)',
  positions: [
    { id: 'gk', x: 50, y: 85, label: 'GK' },
    // Add more positions...
  ]
}
```

### 2. Divisions (`app/formations.ts`)
```typescript
// Add new division
export const DIVISIONS: Division[] = ['U-6', 'U-8', 'U-10', ...]
```

### 3. Action Handlers (`app/dashboard/page.tsx`)
```typescript
// Lines 85-102: Implement reset, undo, redo, save
const handleSaveLineup = () => {
  // Your save logic here
}
```

### 4. Authentication (`app/page.tsx`)
```typescript
// Lines 10-17: Replace guest login with real auth
const handleLogin = async () => {
  // Your authentication logic
}
```

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Styles not loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build errors
```bash
# Check Node.js version
node --version  # Should be 18+

# Update dependencies
npm update
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

1. **Hot Reload**: Changes to code automatically refresh the browser
2. **TypeScript**: Type errors show in terminal and browser
3. **Console**: Check browser console (F12) for runtime errors
4. **Network Tab**: Debug API calls and asset loading

## Getting Help

1. Check `README.md` for detailed documentation
2. See `AUTHENTICATION_GUIDE.md` for auth setup
3. Read `DEPLOYMENT_INSTRUCTIONS.md` for deployment help
4. Check browser console for error messages
5. Search Next.js docs: https://nextjs.org/docs
6. Search Tailwind docs: https://tailwindcss.com/docs

## What's Included

### Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **HTML5 Drag and Drop**: Native browser API

### Features
- Responsive design (mobile, tablet, desktop)
- Dark/light color scheme
- Modern UI with shadows and transitions
- Inline SVGs (no external dependencies)
- Local storage for data persistence
- Static export ready for any hosting

## License

MIT License - Feel free to use for personal or commercial projects

---

**Ready to start?** Run `npm install` then `npm run dev`!
