import React from 'react';
import { Question as QuestionType } from '@/service/types/Question';
import CustomRadioGroup from './CustomRadioButton';
import CustomTextInput from './CustomTextInput';
import { useSurvey } from '@/app/context/SurveyContext';

const ADDITIONAL_INFO_CODES = ['KR004', 'KR005', 'KR006'];

interface QuestionProps {
    question: QuestionType;
    darkMode: boolean;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, darkMode }) => {
    const { answers, updateAnswer } = useSurvey();
    const { code, text, type, options, validation, additional_info } = question;

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
                <div className="dark:text-gray-400 text-sm font-semibold" style={{ color: "#565656" }}>
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

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Question Section */}
            <div className="w-full md:w-1/3 dark:text-gray-300">
                <span className="font-bold" style={{ color: "#565656" }}>
                    {text}
                </span>

                {additional_info && (
                    <>
                        {!ADDITIONAL_INFO_CODES.includes(code) && (
                            <span className="dark:text-gray-400 text-sm font-semibold ml-[5px]" style={{ color: "#565656" }}>
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
            </div>

            {/* Answer Section */}
            <div className="flex-1">
                {type === "select" && options && (
                    <CustomRadioGroup
                        name={code}
                        options={options}
                        selected={answers[code] || ""}
                        onChange={handleChange}
                    />
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
                    />
                )}
            </div>
        </div>
    );
};

export default QuestionComponent;