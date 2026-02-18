"use client";

import { appHeaderStyles as styles } from "./appHeader.styles";
import ProfileButton from "./ProfileButton";

interface AppHeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function AppHeader({
  userName = "Guest User",
  onLogout,
}: AppHeaderProps) {
  const headerContent = {
    title: "Soccer Lineup Organizer",
  };

  return (
    <header className={styles.header.container}>
      <div className={styles.header.inner}>
        <div className={styles.header.layout}>
          {/* Centered Logo + Title */}
          <div className={styles.centerSection.wrapper}>
            <div className={styles.logo.container}>
              <svg
                className={styles.logo.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 0 0 20" />
                <path d="M12 2a10 10 0 0 1 0 20" />
                <path d="M2 12h20" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>

            <div className="text-center">
              <h1 className={styles.text.title}>{headerContent.title}</h1>
            </div>
          </div>

          <div className={styles.user.wrapper}>
            <ProfileButton />
          </div>
        </div>
      </div>
    </header>
  );
}
