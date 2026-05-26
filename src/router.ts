import { useEffect, useState } from "react";

export function navigate(to: string) {
  history.pushState(null, "", to);
  window.dispatchEvent(new Event("routechange"));
}

export function useRoute(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener("routechange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("routechange", sync);
    };
  }, []);
  return path;
}
