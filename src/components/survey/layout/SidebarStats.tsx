import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { surveyQuestions } from '../data/surveyQuestions';
import { characteristicQuestions } from '../data/characteristicQuestions';

interface SidebarStatsProps {
  darkMode: boolean;
}

const SidebarStats: React.FC<SidebarStatsProps> = ({ darkMode }) => {
  const { answers, errors } = useSurvey();
  const [stats, setStats] = useState({
    answered: 0,
    blank: 0,
    error: 0,
    remark: 0,
    total: 0
  });

  useEffect(() => {
    // Calculate total questions from both survey and characteristic questions
    const allQuestions = [...surveyQuestions, ...characteristicQuestions];
    const totalQuestions = allQuestions.length;
    
    // Count answered questions
    const answeredCount = Object.values(answers).filter(value => 
      value && value.trim() !== ''
    ).length;
    
    // Count questions with errors
    const errorCount = Object.keys(errors).length;
    
    // Calculate blank questions (total minus answered)
    const blankCount = totalQuestions - answeredCount;
    
    // Update stats
    setStats({
      answered: answeredCount,
      blank: blankCount,
      error: errorCount,
      remark: 0, // Not currently tracking remarks, so keeping at 0
      total: totalQuestions
    });
  }, [answers, errors]);

  const handleSubmit = () => {
    // No need to check for errors here as the button will be disabled
    
    // Check if all required questions are answered
    const allQuestions = [...surveyQuestions, ...characteristicQuestions];
    const requiredQuestions = allQuestions.filter(q => q.validation.required);
    
    const unansweredRequired = requiredQuestions.filter(q => 
      !answers[q.code] || answers[q.code].trim() === ''
    );
    
    if (unansweredRequired.length > 0) {
      alert(`Mohon lengkapi ${unansweredRequired.length} bidang wajib yang belum diisi.`);
      return;
    }
    
    // If all validations pass, proceed with submission
    console.log('Survey submitted with answers:', answers);
    alert('Survey submitted successfully!');
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = stats.error > 0;

  return (
    <div className="mt-auto p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.answered}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Answer</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.blank}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Blank</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.error}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Error</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.remark}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Remark</p>
        </div>
      </div>
      <button 
        className={`w-full py-3 rounded-md transition ${
          isSubmitDisabled 
            ? 'bg-gray-400 cursor-not-allowed opacity-70' 
            : 'bg-teal-400 hover:bg-teal-500'
        } text-white`}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        {isSubmitDisabled ? `Can't Submit (${stats.error} Error)` : 'Submit'}
      </button>
      
      {isSubmitDisabled && (
        <p className="mt-2 text-xs text-center text-red-500">
          Mohon perbaiki kesalahan pada formulir sebelum melanjutkan
        </p>
      )}
    </div>
  );
};

export default SidebarStats;