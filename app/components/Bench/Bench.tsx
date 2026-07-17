"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { benchStyles as styles } from "./Bench.styles";

// @TODO fix bench styling

export const Bench = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.benchArea} ${open ? styles.benchAreaOpen : styles.benchAreaClosed}`}
      >
        <div className={styles.innerWrapper}>
          <h2 className={styles.title}>Bench</h2>

          <div className={styles.list}>
            {/* TODO: once drag-and-drop lands, benched PlayerCards render here */}
            <p className={styles.emptyText}>No players benched</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={styles.gripButton}
        aria-label={open ? "Collapse bench" : "Expand bench"}
      >
        {open ? (
          <ChevronLeft className={styles.gripIcon} />
        ) : (
          <ChevronRight className={styles.gripIcon} />
        )}
      </button>
    </div>
  );
};

export default Bench;
