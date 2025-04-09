import React from 'react';
import QuestionComponent from '../ui/QuestionComponent';
import { characteristicQuestions } from '../data/characteristicQuestions';

interface KarakteristikTabProps {
  darkMode: boolean;
}

const KarakteristikTab: React.FC<KarakteristikTabProps> = ({ darkMode }) => {

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