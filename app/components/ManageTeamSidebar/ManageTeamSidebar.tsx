import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { sidebarStyles } from "./ManageTeamSidebar.styles";

// services
import {
  updateSplit,
  updateNotes,
  createGameWithLineups,
} from "@/services/games";

// context
import { useGame } from "@/context/GameContext";

// types
import { SplitBy } from "@/app/types";

// util
import { getPeriodsToRemove } from "@/app/utils/period";
import SplitChangeWarningModal from "./SplitChangeWarningModal";
import CreateGameModal from "./CreateGameModal";

interface ManageTeamSidebarProps {
  teamId: string | null;
  maxPlayers?: number;
}

type ToastVariant = "success" | "error";

interface ToastState {
  message: string;
  variant: ToastVariant;
}

export const ManageTeamSidebar: React.FC<ManageTeamSidebarProps> = ({
  teamId,
}) => {
  const { games, currentGame, switchGame, refreshGameData } = useGame();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // @TODO implement formation
  // const [formation, setFormation] = useState("");
  // const [formationError, setFormationError] = useState("");
  const [splitBy, setSplitBy] = useState<SplitBy>();
  const [notes, setNotes] = useState(""); // @TODO save notes to db
  const [pendingSplit, setPendingSplit] = useState<SplitBy | null>(null);
  const [savingSplit, setSavingSplit] = useState(false);

  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  const [creatingGame, setCreatingGame] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Dirty check: button only enabled once the draft differs from what's actually saved on currentGame.
  const notesDirty = notes !== (currentGame?.notes ?? "");

  const showToast = (message: string, variant: ToastVariant = "success") => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 2500);
  };

  const periodsToRemove =
    splitBy && pendingSplit ? getPeriodsToRemove(splitBy, pendingSplit) : [];

  // keep the split selector in sync with the active game
  useEffect(() => {
    if (currentGame) {
      setSplitBy(currentGame.split_by);
      setNotes(currentGame.notes ?? ""); // keep the notes box in sync when switching games
    }
  }, [currentGame]);

  // const checkFormation = () => {
  //   // Empty input: no error, nothing to validate
  //   if (!formation) {
  //     setFormationError("");
  //     return;
  //   }

  //   let error = "";
  //   let total = 0;
  //   let prevnum = 0;

  //   for (const c of formation) {
  //     // invalid character (0, or not a digit/hyphen)
  //     if (c === "0" || (c !== "-" && isNaN(+c))) {
  //       error = "Error: must be a non-zero digit or hyphen.";
  //       break;
  //     }

  //     // start of string must be a digit
  //     if (total === 0 && prevnum === 0) {
  //       if (c === "-") {
  //         error = "The formation must start with a digit";
  //         break;
  //       }
  //     }

  //     if (c === "-") {
  //       // a hyphen with no preceding number => double hyphen / leading hyphen
  //       if (prevnum === 0) {
  //         error = "Error: double hyphens are not allowed";
  //         break;
  //       }
  //       prevnum = 0;
  //     } else {
  //       // a digit
  //       if (prevnum !== 0) {
  //         error = "Error: double digits are not allowed";
  //         break;
  //       }
  //       total += +c;
  //       prevnum = +c;
  //     }
  //   }

  //   // formation cannot end with a hyphen
  //   if (!error && prevnum === 0 && total !== 0) {
  //     error = "Error: formation cannot end with a hyphen";
  //   }

  //   // @TODO check if total exceeds maxPlayers

  //   setFormationError(error);
  // };

  // useEffect(() => {
  //   checkFormation();
  // }, [formation]);

  // handling changing game split
  const handleSplitSelect = (value: SplitBy) => {
    if (!currentGame || !splitBy) return;

    const removed = getPeriodsToRemove(splitBy, value);
    if (removed.length === 0) {
      // Growing or unchanged, no rows removed
      applySplitChange(value);
      return;
    }

    // Shrinking — stage it and let the modal confirm
    setPendingSplit(value);
  };

  const applySplitChange = async (value: SplitBy) => {
    if (!currentGame) return;
    setSavingSplit(true);
    try {
      await updateSplit(currentGame.id, value);
      setSplitBy(value);
      await refreshGameData();
    } catch (err) {
      console.error("Failed to save split type:", err); // @TODO warning modal
    } finally {
      setSavingSplit(false);
      setPendingSplit(null);
    }
  };

  const handleConfirmSplitChange = () => {
    if (pendingSplit) applySplitChange(pendingSplit);
  };

  const handleCancelSplitChange = () => {
    setPendingSplit(null); // select snaps back to splitBy automatically
  };

  // --- Create Game ---
  const handleCreateGame = async (name: string) => {
    if (!teamId) return;
    setCreatingGame(true);
    try {
      const newGame = await createGameWithLineups(teamId, name);
      await refreshGameData(); // pulls the new game (and its lineups) into `games`
      switchGame(newGame.id);
      showToast(`"${newGame.name}" created`);
      setShowCreateGameModal(false);
    } catch (err) {
      console.error("Failed to create game:", err);
      showToast("Couldn't create the game. Try again.", "error");
    } finally {
      setCreatingGame(false);
    }
  };

  // --- Save Notes ---
  const handleSaveNotes = async () => {
    if (!currentGame || !notesDirty) return;
    setSavingNotes(true);
    try {
      await updateNotes(currentGame.id, notes);
      await refreshGameData(); // re-syncs currentGame.notes, which clears notesDirty via the effect above
      showToast("Note saved to this game");
    } catch (err) {
      console.error("Failed to save notes:", err);
      showToast("Couldn't save the note. Try again.", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <>
      {/* Open-sidebar arrow button (visible only when sidebar is collapsed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={sidebarStyles.openButton}
          aria-label="Open sidebar"
        >
          <ChevronRight className={sidebarStyles.openButtonIcon} />
        </button>
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`${sidebarStyles.sidebar} ${sidebarOpen ? sidebarStyles.sidebarOpen : sidebarStyles.sidebarClosed}`}
      >
        <div className={sidebarStyles.innerWrapper}>
          {/* Header row with title + close (X) button */}
          <div className={sidebarStyles.header}>
            <h1 className={sidebarStyles.title}>Manage Team</h1>

            <button
              onClick={() => setSidebarOpen(false)}
              className={sidebarStyles.closeButton}
              aria-label="Close sidebar"
            >
              <X className={sidebarStyles.closeButtonIcon} />
            </button>
          </div>
          {/* Game Selection */}
          <div className={sidebarStyles.fieldGroup}>
            <div className={sidebarStyles.selectWrapper}>
              <select
                className={sidebarStyles.selectInput}
                value={currentGame?.id ?? ""}
                aria-label="Select game"
                onChange={(e) => switchGame(e.target.value)}
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={sidebarStyles.customArrowIcon}
                aria-hidden="true"
              />
            </div>

            {/* Create Game button — opens CreateGameModal, disabled with no team selected */}
            <button
              type="button"
              onClick={() => setShowCreateGameModal(true)}
              disabled={!teamId}
              className={`${sidebarStyles.createGameButton} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className={sidebarStyles.createGamePlus}>
                <Plus size={10} strokeWidth={4} />
              </span>
              Create Game
            </button>
          </div>

          <div className={sidebarStyles.manageSection}>
            {/* Formation */}
            {/* <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Formation:</h2>
              <input
                type="text"
                placeholder="e.g 1-4-5, 4-5, 4-1-3..."
                className={sidebarStyles.textInput}
                onChange={(event) => {
                  setFormation(event.target.value);
                }}
              />
              {formationError && (
                <p className={sidebarStyles.errorText}>{formationError}</p>
              )}
            </div> */}

            {/* Split by */}
            <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Split by:</h2>
              <div className={sidebarStyles.selectWrapper}>
                <select
                  className={sidebarStyles.selectInput}
                  value={splitBy}
                  aria-label="Split by"
                  onChange={(e) => handleSplitSelect(e.target.value as SplitBy)}
                >
                  <option value="none">None</option>
                  <option value="half">Half</option>
                  <option value="quarter">Quarter</option>
                </select>
                <ChevronDown
                  className={sidebarStyles.customArrowIcon}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Notes */}
            <div className={sidebarStyles.fieldGroup}>
              <h2 className={sidebarStyles.sectionTitle}>Notes:</h2>
              <textarea
                placeholder="Add notes here..."
                value={notes}
                className={sidebarStyles.textArea}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
              />
              {/* Save Notes button — disabled until notes actually differ from currentGame.notes */}
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes || !currentGame || !notesDirty}
                className="mt-2 self-start rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {savingNotes ? "Saving…" : "Save Notes"}
              </button>
            </div>
          </div>
        </div>

        {/* Split-shrink confirmation */}
        {pendingSplit && (
          <SplitChangeWarningModal
            open={pendingSplit !== null}
            fromSplit={splitBy!}
            toSplit={pendingSplit}
            periodsToRemove={periodsToRemove}
            saving={savingSplit}
            onConfirm={handleConfirmSplitChange}
            onCancel={handleCancelSplitChange}
          />
        )}
      </aside>

      {/* Create Game modal — lives outside <aside> so it isn't clipped by the sidebar's overflow/collapse animation */}
      <CreateGameModal
        open={showCreateGameModal}
        onClose={() => setShowCreateGameModal(false)}
        onCreate={handleCreateGame}
        creating={creatingGame}
      />

      {/* Toast — shared by Create Game and Save Notes, styled per variant via TOAST_VARIANT_STYLES */}
      {toast && (
        <div
          className={
            sidebarStyles[
              toast.variant === "error" ? "toastError" : "toastSuccess"
            ]
          }
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default ManageTeamSidebar;
