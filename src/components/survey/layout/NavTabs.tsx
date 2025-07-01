import React from 'react';

interface NavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  darkMode: boolean;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, setActiveTab, tabs, darkMode }) => {
  return (
    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-[90%] md:w-1/2 ${darkMode ? 'bg-gray-700/45' : 'bg-[#b3b3b345]'} backdrop-blur-sm rounded-full p-2 mb-4 flex justify-center items-center`}>
      <div className='flex items-center justify-between px-4 gap-1 md:gap-3'>
        {/* Previous button */}
        {activeTab !== "persetujuan" && (
          <button
            className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 ${tabs.findIndex(tab => tab.id === activeTab) === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
              } bg-blue-800 text-white rounded-full`}
            onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 md:h-6 md:w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Tab name - visible on all devices */}
        <div className={`text-center ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium truncate px-2`}>
          {tabs.find(tab => tab.id === activeTab)?.label}
        </div>

        {/* Next button */}
        {activeTab !== "survei" && (
          <button
            className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 ${tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
              } bg-blue-800 text-white rounded-full`}
            onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].id);
              }
            }}
            disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 md:h-6 md:w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavTabs;