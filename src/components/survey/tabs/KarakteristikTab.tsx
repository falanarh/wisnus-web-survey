import React from 'react';
import QuestionComponent from '../ui/QuestionComponent';
import { characteristicQuestions } from '../data/characteristicQuestions';
import { useSurvey } from '@/context/SurveyContext';

interface KarakteristikTabProps {
  darkMode: boolean;
}

const KarakteristikTab: React.FC<KarakteristikTabProps> = ({ darkMode }) => {
  const { isLoading } = useSurvey();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Memuat data karakteristik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 md:p-7 rounded-md`}>
      <div className="w-full min-h-screen space-y-8 pb-16 overflow-y-auto">
        {characteristicQuestions.map((question) => (
          <QuestionComponent 
            key={question.code} 
            question={question} 
            darkMode={darkMode} 
          />
        ))}
      </div>
    </div>
  );
};

export default KarakteristikTab;