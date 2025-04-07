import React from 'react';

interface SidebarStatsProps {
  darkMode: boolean;
}

const SidebarStats: React.FC<SidebarStatsProps> = ({ darkMode }) => {
  return (
    <div className="mt-auto p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>12</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Answer</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>11</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Blank</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>0</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Error</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>0</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Remark</p>
        </div>
      </div>
      <button className="w-full bg-teal-400 text-white py-3 rounded-md hover:bg-teal-500 transition">
        Submit
      </button>
    </div>
  );
};

export default SidebarStats;