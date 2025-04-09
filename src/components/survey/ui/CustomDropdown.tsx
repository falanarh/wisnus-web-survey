import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  name: string;
  options: string[];
  selected: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  name,
  options,
  selected,
  onChange,
  darkMode,
  placeholder = "Pilih opsi",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleSelect = (option: string) => {
    const syntheticEvent = {
      target: {
        name,
        value: option
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle input change for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // When dropdown opens, focus the search input
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleDropdownClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected value display / dropdown trigger */}
      <div
        className={`
          flex justify-between items-center w-full p-3 border rounded-md cursor-pointer
          ${isOpen ? 'border-blue-500' : darkMode ? 'border-gray-600' : 'border-gray-300'}
          ${disabled ? 
            (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : 
            (darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700')
          }
          transition-colors duration-200
        `}
        onClick={handleDropdownClick}
      >
        <div className="truncate">
          {selected || <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{placeholder}</span>}
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 
            ${isOpen ? 'transform rotate-180' : ''} 
            ${disabled ? 'text-gray-400' : (darkMode ? 'text-gray-400' : 'text-gray-500')}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className={`
          absolute z-10 w-full mt-1 overflow-hidden border rounded-md shadow-lg
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
        `}>
          {/* Search input */}
          <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <input
              ref={inputRef}
              type="text"
              className={`
                w-full p-2 rounded-md border
                ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              placeholder="Cari..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Options list */}
          <div className={`max-h-60 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
            {filteredOptions.length === 0 ? (
              <div className={`p-3 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tidak ada hasil
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`
                    p-3 cursor-pointer hover:bg-opacity-10
                    ${selected === option ? 
                      (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') : 
                      (darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                    }
                  `}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={selected || ''} 
        disabled={disabled}
      />
    </div>
  );
};

export default CustomDropdown;