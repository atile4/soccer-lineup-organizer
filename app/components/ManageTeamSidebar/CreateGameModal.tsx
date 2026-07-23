"use client";

import { useState } from "react";
import Modal from "../Modal";

interface CreateGameModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  creating?: boolean;
}

export default function CreateGameModal({
  open,
  onClose,
  onCreate,
  creating = false,
}: CreateGameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return; // guard against blank names
    onCreate(name.trim());
    setName("");
  };

  const handleClose = () => {
    setName(""); // reset the draft if they cancel
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h2 className="text-lg font-bold text-gray-900 pr-6">
        Create a new game
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Give this game plan a name. You can add formations and notes after
        it&apos;s created.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label
          htmlFor="game-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Game name
        </label>
        <input
          id="game-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. vs. Riverside Rovers"
          autoFocus
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={creating}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create game"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
