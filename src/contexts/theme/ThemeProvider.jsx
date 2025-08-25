import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return localStorage.getItem("theme") || systemTheme || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const themeInfo = {
    theme,
    setTheme,
  };

  return <ThemeContext value={themeInfo}>{children}</ThemeContext>;
};

export default ThemeProvider;
