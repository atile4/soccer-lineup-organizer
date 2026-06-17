import React, { TextareaHTMLAttributes, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { sidebarStyles } from "./ManageTeamSidebar.styles";

interface ManageTeamSidebarProps {
  maxPlayers?: number;
}

export const ManageTeamSidebar: React.FC<ManageTeamSidebarProps> = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [formation, setFormation] = useState("");
  const [formationError, setFormationError] = useState("");
  const [splitBy, setSplitBy] = useState("None"); // @TODO get a user's saved splitby from endpoint
  const [notes, setNotes] = useState(""); // @TODO get user's saved notes from endpoint

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
          {/* Split by */}
          <div className={sidebarStyles.fieldGroup}>
            <div className={sidebarStyles.selectWrapper}>
              <select
                className={sidebarStyles.selectInput}
                defaultValue="No Lineup Selected"
                aria-label="Split by"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSplitBy(e.target.value)
                }
              >
                <option value="Placeholder Lineup 1">
                  Placeholder Lineup 1
                </option>
                <option value="Placeholder Lineup 2">
                  Placeholder Lineup 2
                </option>
                <option value="Placeholder Lineup 3">
                  Placeholder Lineup 3
                </option>
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
                  defaultValue="None"
                  aria-label="Split by"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSplitBy(e.target.value)
                  }
                >
                  <option value="None">None</option>
                  <option value="Half">Half</option>
                  <option value="Quarter">Quarter</option>
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
      </aside>
    </>
  );
};

export default ManageTeamSidebar;
