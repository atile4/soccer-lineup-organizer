// Shared chrome for the Modal wrapper and its dialog contents, on tokens.
export const modalStyles = {
  // Modal.tsx wrapper
  overlay: "fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4",
  panel: "relative w-full max-w-md rounded-xl bg-surface p-6 shadow-lg",
  close:
    "absolute right-3 top-3 rounded-md p-1 text-faint hover:bg-surface-subtle hover:text-muted transition-colors",

  // Dialog contents (shared by the confirm/create modals)
  title: "text-h2 pr-6",
  body: "mt-2 text-body-sm text-ink-2",
  bodyStrong: "font-semibold text-ink",
  actions: "mt-6 flex justify-end gap-3",
  fieldLabel: "block text-label text-ink-2 mb-1",

  // Danger chips (e.g. the periods a split change would remove)
  chipList: "mt-3 flex flex-wrap gap-2",
  chipDanger:
    "rounded-full bg-danger-fill px-3 py-1 text-body-sm font-semibold capitalize text-danger",
};
