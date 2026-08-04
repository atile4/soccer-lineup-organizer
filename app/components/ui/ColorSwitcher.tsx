"use client";

import React from "react";

// Jersey color options — valid 6-digit hex. Shared so every team-color picker
// (TeamBuilder, the Manage Teams tab) offers the identical palette.
export const COLOR_SWATCHES = [
  "#dc2626",
  "#f97316",
  "#eab308",
  "#16a34a",
  "#14b8a6",
  "#2563eb",
  "#1e3a8a",
  "#7c3aed",
  "#ec4899",
  "#111827",
  "#e5e7eb",
  "#6b7280",
];

const styles = {
  swatchGrid: "grid grid-cols-6 gap-2 mb-2.5",
  swatch: "aspect-square rounded-md border-2 cursor-pointer",
  swatchActive: "ring-2 ring-offset-2 ring-accent",
  customColorRow: "flex items-center gap-2.5",
  customColorLabel:
    "inline-flex items-center gap-2 text-caption text-muted cursor-pointer",
  customColorInput:
    "w-8 h-8 p-0 border border-border rounded-md bg-transparent cursor-pointer",
  customColorValue: "text-caption text-muted tabular-nums",
};

interface ColorSwitcherProps {
  value: string;
  onChange: (hex: string) => void;
}

// Palette of preset swatches plus a native "custom" picker. Controlled — the
// parent owns the selected hex.
export default function ColorSwitcher({ value, onChange }: ColorSwitcherProps) {
  return (
    <div>
      <div className={styles.swatchGrid}>
        {COLOR_SWATCHES.map((hex) => (
          <button
            key={hex}
            type="button"
            aria-label={hex}
            onClick={() => onChange(hex)}
            className={`${styles.swatch} ${value === hex ? styles.swatchActive : ""}`}
            style={{ background: hex, borderColor: "rgba(0,0,0,.12)" }}
          />
        ))}
      </div>
      <div className={styles.customColorRow}>
        <label className={styles.customColorLabel}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.customColorInput}
          />
          Custom
        </label>
        <span className={styles.customColorValue}>
          Selected {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
