"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import Modal from "../Modal";
import { modalStyles } from "../modal.styles";
import { Button } from "../ui/Button";
import { Slider } from "../ui/Slider";
import PlayerToken from "../PlayerSidebar/PlayerToken";
import { useTeam } from "@/context/TeamContext";
import {
  usePlayerSize,
  MIN_SCALE,
  MAX_SCALE,
  STEP,
  DEFAULT_SCALE,
} from "@/context/PlayerSizeContext";

// Gear button (positioned by the parent, e.g. bottom-left of the field) that
// opens a modal to customize the on-field / bench player-token size. Changes
// are held as a draft and only committed to the (cookie-backed) setting on Save.
export default function FieldSizeControl({
  className,
}: {
  className?: string;
}) {
  const { scale, setScale } = usePlayerSize();
  const { currentTeam } = useTeam();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(scale);

  // Re-seed the draft from the saved value each time the modal opens, so a
  // cancelled edit doesn't leak into the next session.
  useEffect(() => {
    if (open) setDraft(scale);
  }, [open, scale]);

  const handleSave = () => {
    setScale(draft);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className={className}
        aria-label="Player size settings"
        onClick={() => setOpen(true)}
      >
        <Settings size={18} />
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className={modalStyles.title}>Adjust player size</h2>

        {/* Live preview — field tokens use white text, so show it on a pitch
            colored backdrop for legibility. */}
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-[#4a7c3f]">
          <PlayerToken
            name="Player"
            number={10}
            variant="field"
            jerseyColor={currentTeam?.color}
            scale={draft}
          />
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="token-size" className={modalStyles.fieldLabel}>
              Size
            </label>
            <span className="text-body-sm font-semibold tabular-nums text-ink">
              {Math.round(draft * 100)}%
            </span>
          </div>
          <Slider
            id="token-size"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={STEP}
            value={draft}
            onChange={(e) => setDraft(Number(e.target.value))}
          />
        </div>

        <div className={modalStyles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDraft(DEFAULT_SCALE)}
          >
            Reset
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
}
