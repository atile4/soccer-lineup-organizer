"use client";

import Modal from "../Modal";

interface DeleteGameModalProps {
  open: boolean;
  gameName: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteGameModal({
  open,
  gameName,
  deleting,
  onConfirm,
  onCancel,
}: DeleteGameModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className="text-lg font-bold text-gray-900 pr-6">Delete game?</h2>

      <p className="mt-2 text-sm text-gray-600">
        This will permanently delete{" "}
        <span className="font-semibold text-gray-900">{gameName}</span> and all
        of its lineups. This can&apos;t be undone.
      </p>

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
          {deleting ? "Deleting…" : "Delete game"}
        </button>
      </div>
    </Modal>
  );
}
