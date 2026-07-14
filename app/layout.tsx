import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

// context providers
import { AuthProvider } from "@/context/AuthContext";
import { TeamProvider } from "@/context/TeamContext";

export const metadata: Metadata = {
  title: "Soccer Lineup Organizer",
  description: "Create and manage soccer team lineups",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TeamProvider>{children}</TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
