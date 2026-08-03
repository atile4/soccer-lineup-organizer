"use client";

import Modal from "../Modal";
import { modalStyles } from "../modal.styles";
import { Button } from "../ui/Button";

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
      <h2 className={modalStyles.title}>Delete game?</h2>

      <p className={modalStyles.body}>
        This will permanently delete{" "}
        <span className={modalStyles.bodyStrong}>{gameName}</span> and all of its
        lineups. This can&apos;t be undone.
      </p>

      <div className={modalStyles.actions}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          loading={deleting}
        >
          {deleting ? "Deleting…" : "Delete game"}
        </Button>
      </div>
    </Modal>
  );
}
