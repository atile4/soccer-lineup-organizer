"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Users, UserPlus, X } from "lucide-react";
import { teamBuilderStyles as s, themeVars } from "./TeamBuilder.styles";
import { Division } from "@/app/types";
import { DIVISIONS } from "@/app/formations";
import { useAuth } from "@/context/AuthContext";
import { createTeam } from "@/services/teams";
import { createPlayers, NewPlayer } from "@/services/players";

// A player the coach has added to the roster but hasn't saved yet.
// Only exists in this component's state until "Save team" is clicked.
type DraftPlayer = {
  draftId: string; // client-side only, not a DB id
  firstName: string;
  lastName: string;
  number: string; // kept as string while editing, parsed to int on save
  position: string;
};

export default function TeamBuilder() {
  const { session } = useAuth();

  const [theme, setTheme] = useState<"notebook" | "turf">("notebook");
  const [teamName, setTeamName] = useState("");
  const [division, setDivision] = useState<Division>("U-12");
  const [players, setPlayers] = useState<DraftPlayer[]>([]);

  // Add-player form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  };

  // Recomputed whenever the roster changes — flags any jersey number
  // used by more than one player so the coach can catch it before saving.
  const duplicateNumbers = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach((p) => {
      if (p.number) counts[p.number] = (counts[p.number] ?? 0) + 1;
    });
    return Object.keys(counts).filter((n) => counts[n] > 1);
  }, [players]);

  const dupeMessage =
    duplicateNumbers.length === 1
      ? `${duplicateNumbers.length} players share #${duplicateNumbers[0]}`
      : duplicateNumbers.length > 1
        ? `${duplicateNumbers.length} jersey numbers are used more than once (${duplicateNumbers
            .map((n) => `#${n}`)
            .join(", ")})`
        : "";

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() && !lastName.trim()) {
      showToast("Enter a player name first");
      return;
    }
    setPlayers((prev) => [
      ...prev,
      {
        draftId: crypto.randomUUID(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        number: number.trim(),
        position: position.trim(),
      },
    ]);
    setFirstName("");
    setLastName("");
    setNumber("");
    setPosition("");
  };

  const handleRemovePlayer = (draftId: string) => {
    setPlayers((prev) => prev.filter((p) => p.draftId !== draftId));
  };

  const handleSaveTeam = async () => {
    if (!session?.user?.id) {
      showToast("You need to be logged in to save a team");
      return;
    }
    if (!teamName.trim()) {
      showToast("Give your team a name first");
      return;
    }

    setSaving(true);
    try {
      const team = await createTeam(session.user.id, teamName.trim(), division);

      if (players.length > 0) {
        const newPlayers: NewPlayer[] = players.map((p) => ({
          name: `${p.firstName} ${p.lastName}`.trim() || "Unnamed player",
          number: p.number ? parseInt(p.number, 10) : 0,
          position: p.position,
        }));
        await createPlayers(team.id, newPlayers);
      }

      showToast(`Saved "${team.name}" · ${players.length} players`);
      setTeamName("");
      setPlayers([]);
    } catch (err) {
      console.error("Failed to save team:", err);
      showToast("Something went wrong saving your team. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.page} style={themeVars[theme] as React.CSSProperties}>
      <div className={s.container}>
        {/* Heading */}
        <div className={s.headingRow}>
          <div>
            <div className={s.eyebrow}>Coach&apos;s clipboard</div>
            <h2 className={s.title}>Team Builder</h2>
            <p className={s.subtitle}>
              Set up your roster once — name, division, and players. It carries
              straight into your lineups.
            </p>
          </div>
          <div className={s.headingActions}>
            <button
              type="button"
              className={s.themeToggle}
              onClick={() =>
                setTheme((t) => (t === "notebook" ? "turf" : "notebook"))
              }
            >
              {theme === "notebook" ? "Notebook" : "Turf"}
            </button>
            <span className={s.playerCountLabel}>{players.length} players</span>
            <button
              type="button"
              className={s.saveButton}
              onClick={handleSaveTeam}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save team"}
            </button>
          </div>
        </div>

        <div className={s.grid}>
          {/* Left: team details */}
          <section className={s.detailsCard}>
            <h3 className={s.cardTitle}>
              <span className={s.cardIcon}>
                <Users size={13} />
              </span>
              Team details
            </h3>

            <label className={s.fieldLabel}>Team name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Thunderbolts"
              className={s.textInput}
            />

            <label className={s.fieldLabel}>Division</label>
            <div className={s.selectWrapper}>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division)}
                className={s.selectInput}
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className={s.selectChevron} />
            </div>
          </section>

          {/* Right: roster */}
          <section className={s.rightCol}>
            {/* Add player */}
            <div className={s.addCard}>
              <h3 className={s.addCardTitle}>Add players</h3>
              <p className={s.addCardHint}>
                First &amp; last name required. Number and position are
                optional.
              </p>
              <form onSubmit={handleAddPlayer} className={s.addForm}>
                <div className={s.formField}>
                  <label className={s.formLabel}>First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className={s.formInput}
                  />
                </div>
                <div className={s.formField}>
                  <label className={s.formLabel}>Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className={s.formInput}
                  />
                </div>
                <div className={s.formField}>
                  <label className={s.formLabel}>#</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) =>
                      setNumber(
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 2),
                      )
                    }
                    placeholder="00"
                    className={`${s.formInput} ${s.formInputCenter}`}
                  />
                </div>
                <div className={s.formField}>
                  <label className={s.formLabel}>Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. OMF, DMF, LW"
                    className={s.formInput}
                  />
                </div>
                <button type="submit" className={s.addButton}>
                  <span className="inline-flex items-center gap-1.5">
                    <UserPlus size={14} /> Add
                  </span>
                </button>
              </form>
            </div>

            {/* Duplicate number warning */}
            {duplicateNumbers.length > 0 && (
              <div className={s.dupeWarning}>
                <span className={s.dupeWarningText}>{dupeMessage}</span>
              </div>
            )}

            {/* Roster */}
            <div className={s.rosterCard}>
              <div className={s.rosterHeader}>
                <h3 className={s.rosterTitle}>Roster</h3>
                <span className={s.rosterCount}>{players.length}</span>
              </div>

              {players.length === 0 ? (
                <div className={s.emptyState}>
                  <div className={s.emptyIcon}>
                    <Users size={22} />
                  </div>
                  <p className={s.emptyTitle}>No players yet</p>
                  <p className={s.emptySubtitle}>
                    Add your first player above to start the roster.
                  </p>
                </div>
              ) : (
                <ul className={s.rosterList}>
                  {players.map((p) => {
                    const isDupe =
                      p.number && duplicateNumbers.includes(p.number);
                    const name =
                      `${p.firstName} ${p.lastName}`.trim() || "Unnamed player";
                    return (
                      <li
                        key={p.draftId}
                        className={`${s.rosterRow} ${isDupe ? s.rosterRowDupe : ""}`}
                      >
                        <div className={s.numberBadge}>{p.number || "–"}</div>
                        <div className="flex-1 min-w-0">
                          <div className={s.rosterName}>{name}</div>
                          <div className={s.rosterSub}>
                            {p.number ? `No. ${p.number}` : "No number"}
                          </div>
                        </div>
                        {p.position && (
                          <span className={s.positionChip}>{p.position}</span>
                        )}
                        <button
                          type="button"
                          aria-label="Delete player"
                          className={s.deleteButton}
                          onClick={() => handleRemovePlayer(p.draftId)}
                        >
                          <X size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {toast && <div className={s.toast}>{toast}</div>}
    </div>
  );
}
