export const loginStyles = {
  page: "min-h-screen bg-paper flex items-center justify-center py-10 px-4",
  wrapper: "w-full max-w-xl",
  card: "overflow-hidden rounded-xl bg-surface border border-border shadow-lg",
  inner: "px-8 pb-10 pt-8",

  header: "mb-8",
  title: "text-h1 text-center",

  oauthGroup: "grid gap-3",
  oauthButton:
    "flex items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-body-sm font-semibold text-ink-2 shadow-sm transition-colors hover:bg-surface-subtle",

  errorText: "mt-2 text-body-sm text-danger",

  divider: "my-8 flex items-center gap-3 text-body-sm text-muted",
  dividerLine: "h-px flex-1 bg-border",

  form: "space-y-4",
  fieldLabel: "mb-2 block text-label text-ink-2",
  input:
    "w-full rounded-md border border-border bg-surface px-4 py-3 text-body-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-border",

  metaRow: "flex items-center justify-between text-body-sm text-muted",
  metaLink: "font-semibold text-ink-2 hover:text-ink",
  secureBadge:
    "rounded-full bg-surface-subtle px-3 py-1 text-caption font-medium text-muted",

  submitButton:
    "w-full rounded-md bg-accent px-4 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-accent-hover",

  footer: "mt-8 border-t border-border pt-6 text-center text-body-sm text-muted",
  footerLink: "font-semibold text-accent hover:text-accent-hover",
};
