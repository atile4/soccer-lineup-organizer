// app/components/ManageTeamSidebar/SplitChangeWarningModal.tsx
"use client";

import Modal from "../Modal";
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
      <h2 className="text-lg font-bold text-gray-900 pr-6">
        Switch to {SPLIT_LABELS[toSplit]}?
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        This will permanently delete {removedDescription}, along with any
        formation and player assignments in{" "}
        {periodsToRemove.length > 1 ? "them" : "it"}.
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {periodsToRemove.map((period) => (
          <li
            key={period}
            className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold capitalize text-red-700"
          >
            {unit} {period}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={saving}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Deleting…" : "Delete & switch"}
        </button>
      </div>
    </Modal>
  );
}
