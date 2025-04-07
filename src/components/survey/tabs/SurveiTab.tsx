import React from 'react';

interface SurveiTabProps {
  darkMode: boolean;
}

const SurveiTab: React.FC<SurveiTabProps> = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-5 md:p-6 rounded-md m-4 shadow-md`}>
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Survei</h2>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>
        Pertanyaan-pertanyaan survei akan ditampilkan di sini.
      </p>
    </div>
  );
};

export default SurveiTab;