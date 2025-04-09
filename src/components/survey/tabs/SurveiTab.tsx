import React from 'react';
import { surveyQuestions } from '../data/surveyQuestions';
import QuestionComponent from '../ui/QuestionComponent';


interface SurveiTabProps {
  darkMode: boolean;
}

const SurveiTab: React.FC<SurveiTabProps> = ({ darkMode }) => {

  return (
    <div className={`p-5 md:p-7 rounded-md`}>
      <div className="w-full min-h-screen space-y-8 pb-16 overflow-y-auto">
        {surveyQuestions.map((question) => (
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

export default SurveiTab;