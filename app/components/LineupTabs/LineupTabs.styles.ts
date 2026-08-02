export const lineupTabsStyles = {
  // Below lg: horizontal, scrollable strip above the field. At lg+: the original
  // vertical stack, self-start justified to the top of the field. flex-shrink-0
  // keeps the tabs from being squeezed on narrow viewports.
  container:
    "flex flex-row lg:flex-col gap-2 flex-shrink-0 self-center lg:self-start max-w-full overflow-x-auto lg:overflow-visible",

  tab: "w-12 h-12 flex-shrink-0 rounded-lg border text-body-sm font-semibold flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-accent-border",
  tabActive: "bg-accent text-white border-accent shadow-sm",
  tabInactive: "bg-surface text-ink-2 border-border hover:bg-surface-subtle",
};
