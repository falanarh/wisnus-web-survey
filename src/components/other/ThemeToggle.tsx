"use client";

import { useTheme } from "@/components/other/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface ThemeToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeOtherDropdowns?: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isOpen, setIsOpen, closeOtherDropdowns }) => {
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!isOpen && closeOtherDropdowns) {
      closeOtherDropdowns();
    }
    setIsOpen(!isOpen);
  };

  const selectTheme = (selectedTheme: "light" | "dark") => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          transition-colors duration-200
          ${theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200' 
            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
          }
          border shadow-sm backdrop-blur-sm
        `}
        aria-label="Ubah Tema"
      >
        {theme === "light" ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute right-0 mt-2 py-2 w-36 rounded-xl shadow-lg z-20
              border backdrop-blur-lg
              ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
              }
            `}
          >
            <button
              onClick={() => selectTheme("light")}
              className={`
                flex items-center gap-2 w-full px-4 py-2 text-sm
                transition-colors duration-200
                ${theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${theme === 'light' && 'bg-gray-100 dark:bg-gray-700'}
              `}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Terang</span>
              {theme === "light" && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
            <button
              onClick={() => selectTheme("dark")}
              className={`
                flex items-center gap-2 w-full px-4 py-2 text-sm
                transition-colors duration-200
                ${theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
                }
                ${theme === 'dark' && 'bg-gray-700'}
              `}
            >
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Gelap</span>
              {theme === "dark" && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeToggle;