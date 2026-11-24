import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("theme_v2");
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      // ignore
    }
  }
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  return "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const transitioning = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme_v2", theme);
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage dapat diblokir, abaikan
    }
  }, [theme]);

  const toggle = async (event: MouseEvent<HTMLButtonElement>) => {
    if (transitioning.current) return;
    const update = () => flushSync(() => setTheme((t) => t === "dark" ? "light" : "dark"));
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    transitioning.current = true;
    try {
      const transition = document.startViewTransition(update);
      await transition.ready;
      await document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      ).finished;
      await transition.finished;
    } catch {
      // Tema tetap diterapkan jika browser melewati animasi.
    } finally {
      transitioning.current = false;
    }
  };

  return { theme, toggle };
}