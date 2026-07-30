"use client";

import { useEffect, useState } from "react";

// Tailwind's `lg` breakpoint. Above this the dashboard renders as the original
// three-column desktop layout; below it, sidebars become off-canvas drawers and
// the field/tabs/bench stack vertically.
const DESKTOP_QUERY = "(min-width: 1024px)";

// Tracks whether the viewport is at desktop width. Defaults to `true` so the
// first render (and SSR) matches the desktop layout, avoiding a flash of the
// mobile layout on wide screens before the effect runs.
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export default useIsDesktop;
