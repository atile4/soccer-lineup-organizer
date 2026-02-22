"use client";

import { appHeaderStyles as styles } from "./appHeader.styles";

// Components
import ProfileButton from "./ProfileButton";
import LogoAndTitle from "./LogoAndTitle";

interface AppHeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function AppHeader({
  userName = "Guest User",
  onLogout,
}: AppHeaderProps) {
  return (
    <header className={styles.header.container}>
      <div className={styles.header.inner}>
        <div className={styles.header.layout}>
          <LogoAndTitle title={"Soccer Lineup Organizer"} />

          <div className={styles.user.wrapper}>
            <ProfileButton />
          </div>
        </div>
      </div>
    </header>
  );
}
