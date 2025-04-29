import React, { useState, useEffect, useRef } from 'react';
import { useSurvey } from '@/context/SurveyContext';

interface CustomTextInputProps {
  name: string;
  type: string;
  placeholder?: string;
  darkMode: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean; // <-- Tambahkan ini
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  name,
  type,
  placeholder,
  darkMode,
  value,
  onChange,
  min,
  max,
  pattern,
  required,
  disabled, // <-- Tambahkan ini
}) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const { updateError, clearError } = useSurvey();
  const inputRef = useRef<HTMLInputElement>(null);

  // Validate the input whenever value changes and the field has been touched
  useEffect(() => {
    if (!isTouched) return;
    
    const validate = () => {
      try {
        // Check required validation
        if (required && !value.trim()) {
          const errorMsg = 'Bidang ini wajib diisi';
          setLocalError(errorMsg);
          updateError(name, errorMsg);
          return;
        }

        // For phone number validation
        if (name === 'S001' || name.includes('handphone')) {
          // Fixed regex pattern by escaping the + and properly grouping
          const phoneRegex = /^(0[0-9]{7,14}|\+62[0-9]{7,12})$/;
          const isValidPhone = phoneRegex.test(value);
          
          if (value && !isValidPhone) {
            const errorMsg = 'Masukkan nomor handphone yang valid. Nomor harus diawali "0" atau "+62" dan terdiri dari 8–15 digit.';
            setLocalError(errorMsg);
            updateError(name, errorMsg);
            return;
          }
        }

        // Pattern validation
        if (pattern && value.trim()) {
          try {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
              const errorMsg = 'Nilai tidak sesuai format yang diharapkan';
              setLocalError(errorMsg);
              updateError(name, errorMsg);
              return;
            }
          } catch (e) {
            console.error('Invalid regex pattern:', pattern, e);
          }
        }

        // Clear error if validation passes
        if (localError) {
          setLocalError(null);
          clearError(name);
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    };

    // Use debounce to prevent too many validations
    const timeoutId = setTimeout(validate, 300);
    return () => clearTimeout(timeoutId);
  }, [value, isTouched, name, pattern, required, updateError, clearError]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 relative">
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          className={`
            w-full 
            p-2 
            border 
            rounded-md 
            ${localError ? 'border-red-500 text-[#565656]' : darkMode
              ? 'bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              : 'bg-white text-[#565656] border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            outline-none
            transition-colors
            duration-200
            ease-in-out
          `}
          placeholder={placeholder || `Masukkan ${name}`}
          min={min}
          max={max}
          required={required}
          disabled={disabled} // <-- Tambahkan ini
        />
      </div>
      
      {localError && (
        <p className="mt-1 text-sm text-red-500">{localError}</p>
      )}
    </div>
  );
};

export default CustomTextInput;