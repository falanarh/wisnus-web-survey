import React from 'react';

interface CustomTextInputProps {
  name: string;
  type: string;
  placeholder?: string;
  darkMode: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  name,
  type,
  placeholder,
  darkMode,
  value,
  onChange,
  min,
  max
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`
          w-full 
          p-2 
          border 
          rounded-md 
          ${darkMode
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
      />
    </div>
  );
};

export default CustomTextInput;