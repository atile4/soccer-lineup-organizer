"use client";

import AppHeader from "../components/AppHeader/AppHeader";

export default function ManagePage() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader page={"about"} />

      <main className="flex-1 flex overflow-hidden py-4 gap-4">
        <p>Nothing here yet</p>
      </main>
    </div>
  );
}
