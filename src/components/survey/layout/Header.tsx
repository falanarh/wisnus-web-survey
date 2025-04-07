import React from 'react';
import ThemeSwitch from '../ui/ThemeSwitch';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <header className={`border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-4 md:p-7`}>
      {/* Mobile sidebar toggle button */}
      {!sidebarOpen && (
        <button
          className={`md:hidden p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700'} shadow-md`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <h1 className={`text-lg md:text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'} ml-3 md:ml-0`}>
        SURVEI WISATAWAN NUSANTARA 2024
      </h1>

      {/* Dark Mode Toggle */}
      <div className="flex items-center">
        <ThemeSwitch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
    </header>
  );
};

export default Header;