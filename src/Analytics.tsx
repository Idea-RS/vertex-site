import { useEffect } from "react";

/** Starts the site's analytics (src/posthog.ts) once, after first paint and only with a key; renders nothing. */
export function Analytics() {
  useEffect(() => {
    if (!import.meta.env.NEXT_PUBLIC_POSTHOG_KEY || !["tryvertex.tech", "www.tryvertex.tech"].includes(window.location.hostname)) return;
    let stop: (() => void) | undefined;
    let live = true;
    void import("./posthog").then((a) => {
      if (live && a.init()) stop = a.listen();
    });
    return () => {
      live = false;
      stop?.();
    };
  }, []);
  return null;
}
