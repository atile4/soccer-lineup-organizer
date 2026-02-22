"use client";

import { appHeaderStyles as styles } from "./appHeader.styles";

interface LogoAndTitleProps {
  title?: string;
}

export default function LogoAndTitle({
  title = "Soccer Lineup Organizer",
}: LogoAndTitleProps) {
  return (
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
        <h1 className={styles.text.title}>{title}</h1>
      </div>
    </div>
  );
}
