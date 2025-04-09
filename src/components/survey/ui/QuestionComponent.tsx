import React, { useState, useEffect } from 'react';
import { Question as QuestionType } from '@/service/types/Question';
import CustomRadioGroup from './CustomRadioButton';
import CustomTextInput from './CustomTextInput';
import CustomDropdown from './CustomDropdown';
import { useSurvey } from '@/app/context/SurveyContext';

const ADDITIONAL_INFO_CODES = ['KR004', 'KR005', 'KR006'];
const PROVINCE_QUESTION_CODES = ['S002', 'S004'];

interface Province {
  code: string;
  name: string;
}

interface QuestionProps {
  question: QuestionType;
  darkMode: boolean;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, darkMode }) => {
  const { answers, updateAnswer } = useSurvey();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Fetch provinces for specific question codes
  useEffect(() => {
    const fetchProvinces = async () => {
      if (PROVINCE_QUESTION_CODES.includes(code) && type === "select") {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('https://backend-conversational-survey.vercel.app/api/geographic/provinces');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch provinces: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success && Array.isArray(data.data)) {
            setProvinces(data.data);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          console.error('Error fetching provinces:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProvinces();
  }, [code]);

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

  // Get appropriate options for the question
  const getOptions = () => {
    if (PROVINCE_QUESTION_CODES.includes(code) && provinces.length > 0) {
      // Use fetched provinces for province questions
      return provinces.map(province => province.name);
    }
    
    // For other questions, use the provided options
    return options;
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

        {!loading && !error && type === "select" && getOptions() && (
          PROVINCE_QUESTION_CODES.includes(code) ? (
            <CustomDropdown
              name={code}
              options={getOptions() as string[]}
              selected={answers[code] || ""}
              onChange={handleChange}
              darkMode={darkMode}
              placeholder={code === "S002" ? "Pilih provinsi tempat tinggal" : "Pilih provinsi yang dikunjungi"}
            />
          ) : (
            <CustomRadioGroup
              name={code}
              options={getOptions()}
              selected={answers[code] || ""}
              onChange={handleChange}
              multiple={question.multiple}
            />
          )
        )}

        {type === "text" && (
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
        )}
      </div>
    </div>
  );
};

export default QuestionComponent;