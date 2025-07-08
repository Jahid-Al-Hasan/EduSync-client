import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
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
