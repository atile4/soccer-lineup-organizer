"use client";

import { appHeaderStyles as styles } from "./appHeader.styles";

// Context
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// Components
import ProfileButton from "./ProfileButton";
import LogoAndTitle from "./LogoAndTitle";
import { auth } from "@/lib/firebase";

export default function AppHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className={styles.header.container}>
      <div className={styles.header.inner}>
        <div className={styles.header.layout}>
          <LogoAndTitle title={"Soccer Lineup Organizer"} />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.user.wrapper}>
              {user ? (
                <ProfileButton onLogout={handleLogout} />
              ) : (
                <button
                  type="button"
                  className={styles.user.button}
                  onClick={handleLogin}
                  aria-label="Log in"
                >
                  Log in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
