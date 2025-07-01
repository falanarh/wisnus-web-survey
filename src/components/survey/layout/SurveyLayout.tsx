import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NavTabs from './NavTabs';

interface SurveyLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
}

const SurveyLayout = forwardRef<HTMLDivElement, SurveyLayoutProps>(({
  children,
  darkMode,
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  tabs
}, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);
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
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <section className="overflow-hidden h-[calc(100vh-89px)]">
          <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto">
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
});

SurveyLayout.displayName = 'SurveyLayout';

export default SurveyLayout;