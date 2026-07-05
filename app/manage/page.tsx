"use client";

import AppHeader from "../components/AppHeader/AppHeader";

export default function ManagePage() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 flex overflow-hidden py-4 gap-4">
        {/* Content will go here */}
      </main>
    </div>
  );
}
