export const fieldStyles = {
  // The field drop-target wrapper (holds the pitch image + on-field tokens).
  wrapper: "relative flex-shrink-0 rounded-lg max-w-full",
  // Highlight shown while a player is dragged over the field.
  wrapperOver: "ring-2 ring-accent",

  // The pitch image. Mobile: fill available width, cap height so bench/tabs stay
  // reachable. Desktop (lg+): original 900px / calc(100vh - 6rem) caps.
  image:
    "rounded-lg block select-none pointer-events-none w-auto h-auto max-w-full max-h-[65vh] lg:max-w-[900px] lg:max-h-[calc(100vh-6rem)]",

  // A player token positioned on the pitch, centered on its (x, y) point.
  player: "absolute z-10 -translate-x-1/2 -translate-y-1/2",
};
