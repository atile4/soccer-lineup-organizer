"use client";

import Modal from "../Modal";
import { modalStyles } from "../modal.styles";
import { Button } from "../ui/Button";
import { SplitBy } from "@/app/types";

const SPLIT_LABELS: Record<SplitBy, string> = {
  none: "Full game",
  half: "Halves",
  quarter: "Quarters",
};

const SPLIT_UNIT_LABELS: Record<SplitBy, string> = {
  none: "period",
  half: "half",
  quarter: "quarter",
};

// "quarter 3 and quarter 4" / "half 2" / "quarter 2, quarter 3 and quarter 4"
function describeRemovedPeriods(unit: string, periods: number[]): string {
  const items = periods.map((p) => `${unit} ${p}`);
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

interface SplitChangeWarningModalProps {
  open: boolean;
  fromSplit: SplitBy;
  toSplit: SplitBy;
  periodsToRemove: number[];
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SplitChangeWarningModal({
  open,
  fromSplit,
  toSplit,
  periodsToRemove,
  saving,
  onConfirm,
  onCancel,
}: SplitChangeWarningModalProps) {
  const unit = SPLIT_UNIT_LABELS[fromSplit];
  const removedDescription = describeRemovedPeriods(unit, periodsToRemove);

  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className={modalStyles.title}>Switch to {SPLIT_LABELS[toSplit]}?</h2>

      <p className={modalStyles.body}>
        This will permanently delete {removedDescription}, along with any
        formation and player assignments in{" "}
        {periodsToRemove.length > 1 ? "them" : "it"}.
      </p>

      <ul className={modalStyles.chipList}>
        {periodsToRemove.map((period) => (
          <li key={period} className={modalStyles.chipDanger}>
            {unit} {period}
          </li>
        ))}
      </ul>

      <div className={modalStyles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          loading={saving}
        >
          {saving ? "Deleting…" : "Delete & switch"}
        </Button>
      </div>
    </Modal>
  );
}
