"use client";

import AppHeader from "../components/AppHeader/AppHeader";
import TeamBuilder from "../components/TeamBuilder/TeamBuilder";

export default function CreatePage() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-auto">
        <TeamBuilder />
      </main>
    </div>
  );
}
