import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { sidebarStyles } from "./ManageTeamSidebar.styles";

// services
import { fetchGames, updateSplit } from "@/services/games";

// types
import { Game, SplitBy } from "@/app/types";

// util
import { getPeriodsToRemove } from "@/app/utils/period";
import SplitChangeWarningModal from "./SplitChangeWarningModal";

interface ManageTeamSidebarProps {
  teamId: string | null;
  maxPlayers?: number;
}

export const ManageTeamSidebar: React.FC<ManageTeamSidebarProps> = ({
  teamId,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [formation, setFormation] = useState(""); // @TODO figure out how to save formation
  const [formationError, setFormationError] = useState("");
  const [splitBy, setSplitBy] = useState<SplitBy>();
  const [notes, setNotes] = useState(""); // @TODO save notes to db
  const [pendingSplit, setPendingSplit] = useState<SplitBy | null>(null);
  const [savingSplit, setSavingSplit] = useState(false);

  //@TODO save current game to db, load current game
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game>();

  const periodsToRemove =
    splitBy && pendingSplit ? getPeriodsToRemove(splitBy, pendingSplit) : [];

  // fetch games
  useEffect(() => {
    if (teamId) {
      fetchGames(teamId).then((data) => {
        setGames(data);
        setGame(data[0]);
      });
    }
  }, [teamId]);

  // fetch initial split
  useEffect(() => {
    if (game) {
      setSplitBy(game.split_by);
    }
  }, [game]);

  const checkFormation = () => {
    // Empty input: no error, nothing to validate
    if (!formation) {
      setFormationError("");
      return;
    }

    let error = "";
    let total = 0;
    let prevnum = 0;

    for (const c of formation) {
      // invalid character (0, or not a digit/hyphen)
      if (c === "0" || (c !== "-" && isNaN(+c))) {
        error = "Error: must be a non-zero digit or hyphen.";
        break;
      }

      // start of string must be a digit
      if (total === 0 && prevnum === 0) {
        if (c === "-") {
          error = "The formation must start with a digit";
          break;
        }
      }

      if (c === "-") {
        // a hyphen with no preceding number => double hyphen / leading hyphen
        if (prevnum === 0) {
          error = "Error: double hyphens are not allowed";
          break;
        }
        prevnum = 0;
      } else {
        // a digit
        if (prevnum !== 0) {
          error = "Error: double digits are not allowed";
          break;
        }
        total += +c;
        prevnum = +c;
      }
    }

    // formation cannot end with a hyphen
    if (!error && prevnum === 0 && total !== 0) {
      error = "Error: formation cannot end with a hyphen";
    }

    // @TODO check if total exceeds maxPlayers

    setFormationError(error);
  };

  useEffect(() => {
    checkFormation();
  }, [formation]);

  // handling changing game split
  const handleSplitSelect = (value: SplitBy) => {
    if (!game || !splitBy) return;

    const removed = getPeriodsToRemove(splitBy, value);
    if (removed.length === 0) {
      // Growing or unchanged — nothing destructive, just apply it
      applySplitChange(value);
      return;
    }

    // Shrinking — stage it and let the modal confirm
    setPendingSplit(value);
  };

  const applySplitChange = async (value: SplitBy) => {
    if (!game) return;
    setSavingSplit(true);
    try {
      await updateSplit(game.id, value);
      setSplitBy(value);
    } catch (err) {
      console.error("Failed to save split type:", err);
      // consider surfacing this to the coach — a silent console.error
      // means they think it saved when it didn't
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
                value={game?.id ?? ""}
                aria-label="Select game"
                onChange={(e) => {
                  const selected = games.find((g) => g.id === e.target.value);
                  setGame(selected);
                }}
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
          </div>

          <div className={sidebarStyles.manageSection}>
            {/* Formation */}
            <div className={sidebarStyles.fieldGroup}>
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
            </div>

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
                className={sidebarStyles.textArea}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setNotes(e.target.value)
                }
              />
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
    </>
  );
};

export default ManageTeamSidebar;
