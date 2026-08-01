// appHeader.styles.ts

export const appHeaderStyles = {
  header: {
    container: "bg-accent border-b border-black/10 shadow-sm",
    inner: "w-full mx-auto px-4 sm:px-6 lg:px-8",
    layout: "relative flex items-center justify-between py-2.5",
  },

  centerSection: {
    wrapper: "flex items-center space-x-2 sm:space-x-3 min-w-0",
  },

  logo: {
    container:
      "w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 bg-white rounded-lg flex items-center justify-center",
    icon: "w-4 h-4 sm:w-5 sm:h-5 text-accent",
  },

  text: {
    title:
      "text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-white truncate",
    subtitle: "text-caption text-white/60",
  },

  user: {
    wrapper: "",
  },
};
