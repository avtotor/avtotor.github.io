import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || "/";
  }
  return pathname || "/";
}

function withBase(to: string): string {
  if (!BASE) return to;
  return BASE + (to.startsWith("/") ? to : `/${to}`);
}

export function navigate(to: string) {
  history.pushState(null, "", withBase(to));
  window.dispatchEvent(new Event("routechange"));
}

export function useRoute(): string {
  const [path, setPath] = useState(() => stripBase(window.location.pathname));
  useEffect(() => {
    const sync = () => setPath(stripBase(window.location.pathname));
    window.addEventListener("popstate", sync);
    window.addEventListener("routechange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("routechange", sync);
    };
  }, []);
  return path;
}
