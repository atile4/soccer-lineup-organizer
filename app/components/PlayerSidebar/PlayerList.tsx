"use client";

// hooks
import { useState } from "react";
import Link from "next/link";
import { useLineup } from "@/context/LineupContext";
import { usePlayerInfo } from "@/context/PlayerInfoContext";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";

// components
import { Plus } from "lucide-react";
import { useDrop } from "react-dnd";
import PlayerCard from "./PlayerCard";
import Modal from "../Modal";
import { ItemTypes, PlayerDragItem } from "../dnd/itemTypes";

// styles
import { playerSidebarStyles } from "./PlayerSidebar.styles";
import { DraggablePlayer } from "../dnd/DraggablePlayer";

// services
import { createPlayer } from "@/services/players";

// constants
import {
  MAX_PLAYER_NAME_CHARS,
  MAX_PLAYER_NUMBER_CHARS,
  MAX_PLAYER_POSITION_CHARS,
} from "@/app/constants/playerLimits";

// The sidebar list shows only players that aren't yet placed for the active
// lineup. Dropping a placed player back here removes them from the lineup.
export const PlayerList = () => {
  const {
    players,
    unplacedPlayers,
    unplace,
    applyPlayerUpdate,
    removePlayer,
    loading,
    addPlayer,
  } = useLineup();
  const { session, loading: authLoading } = useAuth();
  const { openPlayer } = usePlayerInfo();
  const { currentTeam } = useTeam();

  // Player creation needs an authenticated user AND a team to attach the row
  // to (RLS rejects everything otherwise). While the session is still
  // resolving neither tile renders, so the create button can't flash into a
  // state that would fail on click.
  const canCreatePlayers = !authLoading && !!session && !!currentTeam;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  const nextNumber =
    Math.max(
      ...players
        .map((p) => p.number)
        .filter(
          (playerNumber): playerNumber is number => playerNumber !== null,
        ),
      0,
    ) + 1;

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setName("");
    setNumber("");
    setPosition("");
    setError("");
  };

  const handleCreate = async () => {
    // Defence in depth: the create button is only rendered when this is
    // true, but a stale render must never reach `currentTeam.id` — logged
    // out, there is no team, so the insert would fail anyway.
    if (!canCreatePlayers) {
      setError("You need to be logged in to create players");
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    const parsedNumber = number === "" ? null : Number(number);
    if (
      parsedNumber !== null &&
      (!Number.isInteger(parsedNumber) || parsedNumber < 0)
    ) {
      setError("Number must be a valid whole number");
      return;
    }
    setError("");
    try {
      const player = await createPlayer(currentTeam!.id, {
        name: trimmed,
        number: parsedNumber,
        position: position.trim(),
      });
      addPlayer(player);
      closeCreateModal();
    } catch {
      setError("Failed to create player");
    }
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PLAYER,
      drop: (item: PlayerDragItem) => unplace(item.playerId),
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [unplace],
  );

  return (
    <aside
      ref={(node) => {
        drop(node);
      }}
      className={`${playerSidebarStyles.playerListAside} ${
        isOver ? playerSidebarStyles.playerListAsideIsOver : ""
      }`}
    >
      <div className={playerSidebarStyles.playerListGrid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={playerSidebarStyles.playerListSkeleton} />
            ))
          : unplacedPlayers.map((player) => (
              <DraggablePlayer
                key={player.id}
                playerId={player.id}
                name={player.name}
                number={player.number}
                jerseyColor={currentTeam?.color}
                previewVariant="default"
                onClick={(e) =>
                  openPlayer(
                    player,
                    e.currentTarget,
                    applyPlayerUpdate,
                    removePlayer,
                  )
                }
              >
                <PlayerCard
                  name={player.name}
                  number={player.number}
                  jerseyColor={currentTeam?.color}
                />
              </DraggablePlayer>
            ))}
        {/* Logged out → the create flow is omitted entirely; see the note
            under the grid. Logged in but teamless → the header's "Create
            your first team" covers it, so nothing renders here either. */}
        {!loading && !authLoading && session && currentTeam && (
          <button
            type="button"
            className={playerSidebarStyles.playerListCreateButton}
            aria-label="Create player"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className={playerSidebarStyles.playerListCreateIcon} />
            <span className={playerSidebarStyles.playerListCreateLabel}>
              Create Player
            </span>
          </button>
        )}
      </div>

      {/* Logged out → there's no team to attach a player to (and RLS would
          reject the insert), so the button is gone entirely and we show the
          way in rather than an error. */}
      {!loading && !authLoading && !session && (
        <p className={playerSidebarStyles.playerListLoginNote}>
          <Link
            href="/login"
            className={playerSidebarStyles.playerListLoginLink}
          >
            Log in to start building your team!
          </Link>
        </p>
      )}

      <Modal open={showCreateModal} onClose={closeCreateModal}>
        <h2 className={playerSidebarStyles.createModalTitle}>Create Player</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className={playerSidebarStyles.createModalForm}
        >
          <div>
            <label
              htmlFor="player-name"
              className={playerSidebarStyles.createModalLabel}
            >
              Name
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value.slice(0, MAX_PLAYER_NAME_CHARS))
              }
              maxLength={MAX_PLAYER_NAME_CHARS}
              className={playerSidebarStyles.createModalInput}
              placeholder="Player name"
              autoFocus
            />
            <span className={playerSidebarStyles.createModalCounter}>
              {name.length}/{MAX_PLAYER_NAME_CHARS}
            </span>
            {error && (
              <p className={playerSidebarStyles.createModalError}>{error}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="player-number"
              className={playerSidebarStyles.createModalLabel}
            >
              Number
            </label>
            <input
              id="player-number"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={number}
              onChange={(e) =>
                setNumber(
                  e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, MAX_PLAYER_NUMBER_CHARS),
                )
              }
              maxLength={MAX_PLAYER_NUMBER_CHARS}
              placeholder={String(nextNumber)}
              className={playerSidebarStyles.createModalInput}
            />
            <span className={playerSidebarStyles.createModalCounter}>
              {number.length}/{MAX_PLAYER_NUMBER_CHARS}
            </span>
          </div>
          <div>
            <label
              htmlFor="player-position"
              className={playerSidebarStyles.createModalLabel}
            >
              Position
            </label>
            <input
              id="player-position"
              type="text"
              value={position}
              onChange={(e) =>
                setPosition(e.target.value.slice(0, MAX_PLAYER_POSITION_CHARS))
              }
              maxLength={MAX_PLAYER_POSITION_CHARS}
              className={playerSidebarStyles.createModalInput}
              placeholder="e.g FWD, DMF, LW"
            />
            <span className={playerSidebarStyles.createModalCounter}>
              {position.length}/{MAX_PLAYER_POSITION_CHARS}
            </span>
          </div>
          <div className={playerSidebarStyles.createModalActions}>
            <button
              type="button"
              onClick={closeCreateModal}
              className={playerSidebarStyles.createModalCancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={playerSidebarStyles.createModalSubmitButton}
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </aside>
  );
};
