import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SurveyContextType {
  answers: Record<string, string>;
  updateAnswer: (questionCode: string, value: string) => void;
  isQuestionAnswered: (questionCode: string) => boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};

interface SurveyProviderProps {
  children: ReactNode;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswer = (questionCode: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionCode]: value
    }));
  };

  const isQuestionAnswered = (questionCode: string) => {
    return !!answers[questionCode] && answers[questionCode].trim() !== '';
  };

  const value = {
    answers,
    updateAnswer,
    isQuestionAnswered
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};