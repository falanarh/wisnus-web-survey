import React, { useState } from 'react';
import { Question as QuestionType } from '@/service/types/Question';
import CustomRadioGroup from './CustomRadioButton';
import CustomTextInput from './CustomTextInput';
import LocationDropdown from './LocationDropdown';
import { useSurvey } from '@/app/context/SurveyContext';

const ADDITIONAL_INFO_CODES = ['KR004', 'KR005', 'KR006'];
const PROVINCE_QUESTION_CODES = ['S002', 'S004'];
const REGENCY_QUESTION_CODES = ['S003', 'S005'];

interface QuestionProps {
  question: QuestionType;
  darkMode: boolean;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, darkMode }) => {
  const { answers, updateAnswer } = useSurvey();
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  
  const { 
    code, 
    text, 
    type, 
    options, 
    validation, 
    additional_info, 
    unit,
    instruction 
  } = question;

  // Get the related province question code for this regency question
  const getRelatedProvinceCode = () => {
    if (code === 'S003') return 'S002';
    if (code === 'S005') return 'S004';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAnswer(code, e.target.value);
  };

  const renderAdditionalInfo = () => {
    if (!additional_info) return null;

    const lines = additional_info.split('\n');
    const firstLine = lines[0];
    const listItems = lines.slice(1);

    return (
      <>
        {validation.required && <span className="text-red-500 ml-[5px]">*</span>}
        <div className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-[#565656]'}`}>
          <p>{firstLine}</p>
          {listItems.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {listItems.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  };

  // Get placeholder text based on question code
  const getPlaceholder = () => {
    if (code === 'S002') return 'Pilih provinsi tempat tinggal';
    if (code === 'S004') return 'Pilih provinsi yang dikunjungi';
    if (code === 'S003') return 'Pilih kabupaten/kota tempat tinggal';
    if (code === 'S005') return 'Pilih kabupaten/kota yang dikunjungi';
    return `Pilih ${text.toLowerCase()}`;
  };

  // Render location dropdown or standard input based on question type
  const renderInput = () => {
    // For province and regency questions, use the specialized LocationDropdown component
    if ((PROVINCE_QUESTION_CODES.includes(code) || REGENCY_QUESTION_CODES.includes(code)) && type === "select") {
      return (
        <LocationDropdown
          questionCode={code}
          darkMode={darkMode}
          placeholder={getPlaceholder()}
          relatedProvinceCode={getRelatedProvinceCode()}
        />
      );
    }
    
    // For standard select questions
    if (type === "select" && options) {
      return (
        <CustomRadioGroup
          name={code}
          options={options}
          selected={answers[code] || ""}
          onChange={handleChange}
          multiple={question.multiple}
        />
      );
    }
    
    // For text input questions
    if (type === "text") {
      return (
        <CustomTextInput
          name={code}
          type={validation.input_type || "text"}
          placeholder={`Masukkan ${text.toLowerCase()}`}
          darkMode={darkMode}
          value={answers[code] || ""}
          onChange={handleChange}
          min={validation.min}
          max={validation.max}
          pattern={validation.pattern}
          required={validation.required}
          unit={unit}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Question Section */}
      <div className="w-full md:w-1/3 dark:text-gray-300">
        <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-[#565656]'}`}>
          {text}
        </span>

        {additional_info && (
          <>
            {!ADDITIONAL_INFO_CODES.includes(code) && (
              <span className={`text-sm font-semibold ml-[5px] ${darkMode ? 'text-gray-400' : 'text-[#565656]'}`}>
                {"(" + additional_info + ")"}
                {validation.required && <span className="text-red-500 ml-[5px]">*</span>}
              </span>
            )}
            {ADDITIONAL_INFO_CODES.includes(code) && renderAdditionalInfo()}
          </>
        )}

        {!additional_info && validation.required && (
          <span className="text-red-500 ml-[5px]">*</span>
        )}

        {instruction && (
          <div className={`mt-1 text-xs italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {instruction}
          </div>
        )}
      </div>

      {/* Answer Section */}
      <div className="flex-1">
        {loading && (
          <div className={`py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memuat data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="py-4 text-sm text-red-500">
            Error: {error}
            <button 
              className="ml-2 text-blue-500 underline" 
              onClick={() => window.location.reload()}
            >
              Muat ulang
            </button>
          </div>
        )}

        {!loading && !error && renderInput()}
      </div>
    </div>
  );
};

export default QuestionComponent;