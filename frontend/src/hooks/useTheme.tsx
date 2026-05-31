import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  // initialize from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem("cinelog-theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // apply theme to document root and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cinelog-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return { theme, toggleTheme };
}