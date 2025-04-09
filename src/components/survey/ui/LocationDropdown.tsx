import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import { useSurvey } from '@/app/context/SurveyContext';

interface Province {
    code: string;
    name: string;
}

interface Regency {
    code: string;
    name: string;
    _id: string;
}

interface LocationDropdownProps {
    questionCode: string;
    darkMode: boolean;
    placeholder: string;
    relatedProvinceCode: string | null;
}

const PROVINCE_QUESTION_CODES = ['S002', 'S004'];
const REGENCY_QUESTION_CODES = ['S003', 'S005'];

const LocationDropdown: React.FC<LocationDropdownProps> = ({
    questionCode,
    darkMode,
    placeholder,
    relatedProvinceCode
}) => {
    const { answers, updateAnswer } = useSurvey();
    const [options, setOptions] = useState<string[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loading, setLoading] = useState<{
        [key: string]: boolean
    }>({
        S002: false,
        S003: false,
        S004: false,
        S005: false
    });
    const [error, setError] = useState<string | null>(null);

    const isRegencyQuestion = REGENCY_QUESTION_CODES.includes(questionCode);
    const isProvinceQuestion = PROVINCE_QUESTION_CODES.includes(questionCode);

    // Get the province code (not name) for API calls
    const getProvinceCodeByName = (provinceName: string) => {
        const province = provinces.find(p => p.name === provinceName);
        return province ? province.code : null;
    };

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            // We need provinces data for both province questions and regency questions
            if (isProvinceQuestion || isRegencyQuestion) {
                try {
                    // Set loading for the specific question
                    setLoading(prev => ({...prev, [questionCode]: true}));
                    setError(null);

                    const response = await fetch('https://backend-conversational-survey.vercel.app/api/geographic/provinces');

                    if (!response.ok) {
                        throw new Error(`Failed to fetch provinces: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.success && Array.isArray(data.data)) {
                        setProvinces(data.data);

                        // If this is a province dropdown, set the options
                        if (isProvinceQuestion) {
                            setOptions(data.data.map((province: Province) => province.name));
                        }
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                    console.error('Error fetching provinces:', err);
                } finally {
                    // Reset loading for the specific question
                    setLoading(prev => ({...prev, [questionCode]: false}));
                }
            }
        };

        fetchProvinces();
    }, [questionCode, isProvinceQuestion, isRegencyQuestion]);

    // Fetch regencies when related province changes
    useEffect(() => {
        const fetchRegencies = async () => {
            if (isRegencyQuestion && relatedProvinceCode) {
                const selectedProvinceName = answers[relatedProvinceCode];

                // Clear options if no province is selected
                if (!selectedProvinceName) {
                    setOptions([]);
                    return;
                }

                const provinceCode = getProvinceCodeByName(selectedProvinceName);
                if (!provinceCode) {
                    setOptions([]);
                    return;
                }

                try {
                    // Set loading for the specific question
                    setLoading(prev => ({...prev, [questionCode]: true}));
                    setError(null);

                    const response = await fetch(`https://backend-conversational-survey.vercel.app/api/geographic/provinces/${provinceCode}/regencies`);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch regencies: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.success && Array.isArray(data.data)) {
                        setOptions(data.data.map((regency: Regency) => regency.name));

                        // Clear current selection if it's no longer in the options
                        const currentSelection = answers[questionCode];
                        if (currentSelection && !data.data.some((r: Regency) => r.name === currentSelection)) {
                            updateAnswer(questionCode, '');
                        }
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                    console.error('Error fetching regencies:', err);
                } finally {
                    // Reset loading for the specific question
                    setLoading(prev => ({...prev, [questionCode]: false}));
                }
            }
        };

        fetchRegencies();
    }, [questionCode, relatedProvinceCode, answers, updateAnswer, isRegencyQuestion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateAnswer(questionCode, e.target.value);
    };

    const isDisabled = isRegencyQuestion && (!relatedProvinceCode || !answers[relatedProvinceCode]);
    const isCurrentlyLoading = loading[questionCode];

    return (
        <div>
            {isRegencyQuestion && isDisabled && (
                <div className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    {questionCode === 'S003' ? 'Silakan pilih provinsi terlebih dahulu' : 'Silakan pilih provinsi yang dikunjungi terlebih dahulu'}
                </div>
            )}

            {isCurrentlyLoading && (
                <div className={`py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>
                            {isProvinceQuestion ? 'Memuat data provinsi...' : 'Memuat data kabupaten/kota...'}
                        </span>
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

            {!isCurrentlyLoading && !error && (
                <CustomDropdown
                    name={questionCode}
                    options={options}
                    selected={answers[questionCode] || ""}
                    onChange={handleChange}
                    darkMode={darkMode}
                    placeholder={placeholder}
                    disabled={isDisabled}
                />
            )}
        </div>
    );
};

export default LocationDropdown;