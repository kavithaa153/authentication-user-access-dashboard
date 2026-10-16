import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import "./App.css";

function ThemeManager() {
  useEffect(() => {
    function applyTheme() {
      let theme = "Light";

      try {
        const savedSettings = JSON.parse(
          localStorage.getItem("accesshub_settings") || "{}"
        );

        theme = savedSettings.theme || "Light";
      } catch {
        theme = "Light";
      }

      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const isDark =
        theme === "Dark" ||
        (theme === "System" && isSystemDark);

      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    applyTheme();

    mediaQuery.addEventListener("change", applyTheme);
    window.addEventListener("storage", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeManager />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;