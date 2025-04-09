import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question } from '@/service/types/Question';

interface SurveyContextType {
  answers: Record<string, string>;
  errors: Record<string, string>;
  updateAnswer: (questionCode: string, value: string) => void;
  isQuestionAnswered: (questionCode: string) => boolean;
  isQuestionValid: (question: Question) => boolean;
  validateQuestion: (question: Question) => boolean;
  getCompletionStatus: () => {
    answered: number;
    blank: number;
    error: number;
    total: number;
  };
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
  initialAnswers?: Record<string, string>;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ 
  children, 
  initialAnswers = {} 
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAnswer = (questionCode: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionCode]: value
    }));
    
    // Clear error for this question when answered
    if (errors[questionCode]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionCode];
        return newErrors;
      });
    }
  };

  const isQuestionAnswered = (questionCode: string) => {
    return !!answers[questionCode] && answers[questionCode].trim() !== '';
  };

  const validateQuestion = (question: Question): boolean => {
    const { code, validation, type } = question;
    const value = answers[code] || '';
    
    // Check required validation
    if (validation.required && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [code]: 'Bidang ini wajib diisi'
      }));
      return false;
    }
    
    // If not required and empty, it's valid
    if (!value.trim()) {
      return true;
    }
    
    // Check pattern validation
    if (validation.pattern && value.trim()) {
      // Special case for phone number validation
      if (code === 'S001' || code.toLowerCase().includes('handphone')) {
        // Indonesian phone number validation
        const phoneRegex = /^(0[0-9]{7,14}|\+62[0-9]{7,12})$/;
        if (!phoneRegex.test(value)) {
          setErrors(prev => ({
            ...prev,
            [code]: 'Masukkan nomor handphone yang valid. Nomor harus diawali "0" atau "+62" dan terdiri dari 8–15 digit.'
          }));
          return false;
        }
      } else {
        // For other patterns
        try {
          if (!new RegExp(validation.pattern).test(value)) {
            setErrors(prev => ({
              ...prev,
              [code]: 'Nilai tidak sesuai format'
            }));
            return false;
          }
        } catch (e) {
          console.error('Invalid regex pattern:', validation.pattern, e);
          // Even if the regex is invalid, we don't want to block the form submission
        }
      }
    }
    
    // Check min validation for number inputs
    if (type === 'text' && validation.input_type === 'number' && 
        validation.min !== undefined && Number(value) < validation.min) {
      setErrors(prev => ({
        ...prev,
        [code]: `Nilai minimum adalah ${validation.min}`
      }));
      return false;
    }
    
    // Check max validation for number inputs
    if (type === 'text' && validation.input_type === 'number' && 
        validation.max !== undefined && Number(value) > validation.max) {
      setErrors(prev => ({
        ...prev,
        [code]: `Nilai maksimum adalah ${validation.max}`
      }));
      return false;
    }
    
    // If multiple choices (comma-separated values), check minimum selection for multiple select
    if (type === 'select' && question.multiple && question.instruction?.includes('Paling sedikit')) {
      const selectedCount = value.split(',').filter(v => v.trim()).length;
      const requiredCount = 2; // Default value from the instruction
      
      if (selectedCount < requiredCount) {
        setErrors(prev => ({
          ...prev,
          [code]: `Pilih minimal ${requiredCount} opsi`
        }));
        return false;
      }
    }
    
    // Remove error if validation passes
    if (errors[code]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[code];
        return newErrors;
      });
    }
    
    return true;
  };

  const isQuestionValid = (question: Question): boolean => {
    const { code } = question;
    return !errors[code];
  };

  const getCompletionStatus = () => {
    // Count would need to be based on the actual questions in the survey
    // This is a placeholder implementation
    const totalQuestions = Object.keys(answers).length;
    const answeredQuestions = Object.keys(answers).filter(key => 
      answers[key] && answers[key].trim() !== ''
    ).length;
    const errorQuestions = Object.keys(errors).length;
    
    return {
      answered: answeredQuestions,
      blank: totalQuestions - answeredQuestions,
      error: errorQuestions,
      total: totalQuestions
    };
  };

  const value = {
    answers,
    errors,
    updateAnswer,
    isQuestionAnswered,
    isQuestionValid,
    validateQuestion,
    getCompletionStatus,
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};