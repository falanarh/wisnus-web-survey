import React, { useState, useEffect } from 'react';

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
  unit?: string;
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
  unit
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  
  // Validate the input whenever value changes and the field has been touched
  useEffect(() => {
    if (!isTouched) return;
    
    // Check required validation
    if (required && !value.trim()) {
      setError('Bidang ini wajib diisi');
      return;
    }
    
    // Check pattern validation
    if (pattern && value.trim()) {
      // For phone number validation, use a specific pattern regardless of what's passed
      if (name === 'S001' || name.includes('handphone')) {
        // Indonesian phone number validation
        const phoneRegex = /^(0[0-9]{7,14}|\+62[0-9]{7,12})$/;
        if (!phoneRegex.test(value)) {
          setError('Masukkan nomor handphone yang valid. Nomor harus diawali "0" atau "+62" dan terdiri dari 8–15 digit.');
          return;
        }
      } else {
        // For other patterns
        try {
          const regex = new RegExp(pattern);
          if (!regex.test(value)) {
            setError('Nilai tidak sesuai format yang diharapkan');
            return;
          }
        } catch (e) {
          console.error('Invalid regex pattern:', pattern, e);
        }
      }
    }
    
    // Check min validation for number inputs
    if (type === 'number' && min !== undefined && value && Number(value) < min) {
      setError(`Nilai minimum adalah ${min}`);
      return;
    }
    
    // Check max validation for number inputs
    if (type === 'number' && max !== undefined && value && Number(value) > max) {
      setError(`Nilai maksimum adalah ${max}`);
      return;
    }
    
    // If we get here, there's no error
    setError(null);
  }, [value, isTouched, required, pattern, min, max, type, name]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <input
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
            ${error ? 'border-red-500 text-[#565656]' : darkMode
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
        />
        {unit && (
          <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {unit}
          </span>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomTextInput;