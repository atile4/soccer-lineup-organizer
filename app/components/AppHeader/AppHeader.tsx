"use client";

import { appHeaderStyles as styles } from "./appHeader.styles";

// Context
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Components
import ProfileMenu from "./ProfileMenu";
import LogoAndTitle from "./LogoAndTitle";

export default function AppHeader() {
  const { session, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
              {session ? (
                <ProfileMenu onLogout={handleLogout} />
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
