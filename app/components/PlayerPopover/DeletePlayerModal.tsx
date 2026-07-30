"use client";

import Modal from "../Modal";
import { Player } from "@/app/types";

interface DeletePlayerModalProps {
  open: boolean;
  player: Player;
  // Where the player currently sits in the active lineup (field / bench / etc.)
  status: string;
  deleting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeletePlayerModal({
  open,
  player,
  status,
  deleting,
  error,
  onConfirm,
  onCancel,
}: DeletePlayerModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className="text-lg font-bold text-gray-900 pr-6">
        Delete {player.name}?
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        This permanently removes this player from your roster and every lineup
        they appear in. This can’t be undone.
      </p>

      {/* Quick snapshot of the player before they’re gone */}
      <dl className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
          <dt className="text-xs font-medium text-gray-500">Number</dt>
          <dd className="mt-0.5 text-base font-semibold text-gray-900">
            #{player.number}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
          <dt className="text-xs font-medium text-gray-500">Position</dt>
          <dd className="mt-0.5 text-base font-semibold text-gray-900">
            {player.position || "—"}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-center">
          <dt className="text-xs font-medium text-gray-500">Status</dt>
          <dd className="mt-0.5 text-sm font-semibold text-gray-900">
            {status}
          </dd>
        </div>
      </dl>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={deleting}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete player"}
        </button>
      </div>
    </Modal>
  );
}
