"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { benchStyles as styles } from "./Bench.styles";

export const Bench = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${styles.wrapper} ${open ? styles.wrapperOpen : styles.wrapperClosed}`}
    >
      <div className={styles.header}>
        {open && <h2 className={styles.title}>Bench</h2>}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={styles.toggleButton}
          aria-label={open ? "Collapse bench" : "Expand bench"}
        >
          {open ? (
            <ChevronRight className={styles.toggleIcon} />
          ) : (
            <ChevronLeft className={styles.toggleIcon} />
          )}
        </button>
      </div>

      {open && (
        <div className={styles.benchArea}>
          {/* TODO: once drag-and-drop is implemented, benched players render here */}
          <p className={styles.emptyText}>No players on bench</p>
        </div>
      )}
    </div>
  );
};

export default Bench;
