import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soccer Lineup Organizer',
  description: 'Create and manage soccer team lineups',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
