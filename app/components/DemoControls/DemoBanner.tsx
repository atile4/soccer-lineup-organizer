"use client";

import { useAuth } from "@/context/AuthContext";
import { useDemo } from "@/context/DemoContext";
import { demoBannerStyles as styles } from "./DemoBanner.styles";

// Demo Banner
export default function DemoBanner() {
  const { session, loading } = useAuth();
  const { isDemo, disable } = useDemo();

  if (loading || session || !isDemo) return null;

  return (
    <div
      className={styles.banner.container}
      role="status"
      aria-label="Demo mode active"
    >
      <span className={styles.banner.text}>Demo mode</span>
      <button
        type="button"
        onClick={disable}
        className={styles.banner.exitButton}
      >
        Exit
      </button>
    </div>
  );
}
