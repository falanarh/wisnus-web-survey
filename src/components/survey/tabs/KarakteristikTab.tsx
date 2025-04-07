import React from 'react';

interface KarakteristikTabProps {
  darkMode: boolean;
}

const KarakteristikTab: React.FC<KarakteristikTabProps> = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-5 md:p-6 rounded-md m-4 shadow-md`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Karakteristik Responden</h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>
        Form untuk data karakteristik responden.
      </p>
    </div>
  );
};

export default KarakteristikTab;