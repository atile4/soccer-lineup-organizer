// appHeader.styles.ts

export const appHeaderStyles = {
  header: {
    container: "bg-green-600 shadow-sm border-b border-gray-200",
    inner: "w-full mx-auto px-4 sm:px-6 lg:px-8",
    layout: "relative flex items-center justify-between py-4",
  },

  centerSection: {
    wrapper: "flex items-center space-x-3",
  },

  logo: {
    container:
      "w-10 h-10 bg-primary rounded-lg flex items-center justify-center",
    icon: "w-6 h-6 text-white",
  },

  text: {
    title: "text-xl font-bold text-gray-100",
    subtitle: "text-sm text-gray-500 text-center",
  },

  user: {
    wrapper: "",
    button: "flex items-center space-x-2 px-4 py-2 text-white font-medium border border-white/70 rounded-lg hover:bg-white hover:text-green-700 transition-colors duration-150",
    icon: "w-5 h-5",
    name: "text-sm font-medium",
  },
};
