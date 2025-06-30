"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  disableTransitionOnChange?: boolean;
  attribute?: string;
}

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextType = {
  theme: "light", // Changed default to light
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Changed default to light
  disableTransitionOnChange = false,
  attribute = "class",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme as Theme);
  const [mounted, setMounted] = useState(false);

  // Handle theme change
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";

    // Remove transition class
    if (disableTransitionOnChange) {
      root.classList.add("no-theme-transition");
    }

    // Apply theme attribute
    if (attribute === "class") {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else {
      root.setAttribute(attribute, isDark ? "dark" : "light");
    }

    // Re-enable transitions
    if (disableTransitionOnChange) {
      window.setTimeout(() => {
        root.classList.remove("no-theme-transition");
      }, 0);
    }
  };

  // Update theme
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, mounted]);

  // Initialize
  useEffect(() => {
    // Apply light theme immediately to avoid flash of dark theme
    if (!mounted) {
      document.documentElement.classList.remove("dark");
    }
    
    setMounted(true);
    
    // Read from localStorage or use default
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(savedTheme);
    } else {
      // Explicitly set light as default if nothing in localStorage
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, [mounted]);

  // Handle theme setting with local storage persistence
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};