import React, { useCallback } from 'react';
import SidebarStats from './SidebarStats';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  activeTab,
  setActiveTab,
  tabs
}) => {
  const handleOverlayClick = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  }, [setActiveTab, setSidebarOpen]);

  return (
    <aside
      className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:relative md:flex md:flex-col md:basis-1/4 md:min-w-[250px] md:max-w-[300px] border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} transition-all duration-300 ease-in-out`}
    >
      {/* Overlay for mobile - closes sidebar when clicking outside */}
      <div
        className={`${sidebarOpen ? 'block fixed inset-0 bg-black bg-opacity-50 z-30' : 'hidden'} md:hidden`}
        onClick={handleOverlayClick}
      ></div>

      {/* Sidebar content container */}
      <div className={`relative h-full w-[85vw] max-w-[300px] ${darkMode ? 'bg-gray-800' : 'bg-white'} z-40 md:w-auto md:max-w-none flex flex-col`}>
        {/* Close button - mobile only */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700"
          onClick={handleOverlayClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Header */}
        <div className="p-8 pb-4">
          <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>WISNUS 2025</p>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`text-left rounded-lg my-1 mx-5 p-3 ${activeTab === tab.id
                ? 'bg-blue-800 text-white'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-[#565656] hover:bg-gray-100'
                }`}
              onClick={() => handleTabClick(tab.id)}
            >
              <p className='text-md font-bold'>
                {tab.label}
              </p>
              {tab.label === 'Persetujuan' && (
                <p className='text-sm'>
                  {tab.label}
                </p>
              )}

              {tab.label === 'Karakteristik Responden' && (
                <p className='text-sm'>
                  {tab.label}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Survey Stats */}
        <SidebarStats />
      </div>
    </aside>
  );
};

export default Sidebar;