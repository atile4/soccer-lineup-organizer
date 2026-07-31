import type { Metadata } from "next";
import "./globals.css";
import { Caveat, Inter } from "next/font/google";

// context providers
import { AuthProvider } from "@/context/AuthContext";
import { TeamProvider } from "@/context/TeamContext";
import { GameProvider } from "@/context/GameContext";

export const metadata: Metadata = {
  title: "Soccer Lineup Organizer",
  description: "Create and manage soccer team lineups",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${caveat.variable} ${inter.className}`}
      >
        <AuthProvider>
          <TeamProvider>
            <GameProvider>{children}</GameProvider>
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
