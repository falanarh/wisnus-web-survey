import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NavTabs from './NavTabs';
interface SurveyLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
}

const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  children,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  tabs
}) => {
  return (
    <div className={`flex w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Main Content */}
      <main className={`flex-1 w-full md:w-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <section className="overflow-hidden h-[calc(100vh-89px)]">
          <div className="flex flex-col h-full overflow-y-auto">
            {children}
          </div>
        </section>

        {/* Navigation Tabs */}
        <NavTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          darkMode={darkMode}
        />
      </main>
    </div>
  );
};

export default SurveyLayout;