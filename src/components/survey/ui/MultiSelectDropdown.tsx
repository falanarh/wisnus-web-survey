import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface MultiSelectDropdownProps {
  name: string;
  options: string[];
  value: string; // Comma-separated selected values
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  darkMode: boolean;
  disabled?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  name,
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi',
  darkMode,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value ? value.split(',').filter(Boolean) : []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update component state when props change
  useEffect(() => {
    setSelectedValues(value ? value.split(',').filter(Boolean) : []);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(
    (option) => 
      !selectedValues.includes(option) && 
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleOption = (option: string) => {
    let newSelected: string[];
    
    if (selectedValues.includes(option)) {
      // Remove option if already selected
      newSelected = selectedValues.filter((item) => item !== option);
    } else {
      // Add option if not already selected
      newSelected = [...selectedValues, option];
    }
    
    setSelectedValues(newSelected);
    
    // Create synthetic event to match onChange handler interface
    const syntheticEvent = {
      target: {
        name,
        value: newSelected.join(','),
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    
    // Clear search after selection
    setSearchTerm('');
    
    // Don't close dropdown after selection to allow multiple selections
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dropdown when removing an item
    handleToggleOption(option);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected items display / dropdown trigger */}
      <div
        className={`flex items-center min-h-[46px] w-full px-3 py-2 border rounded-md cursor-pointer transition-colors duration-200 ${
          isOpen
            ? `border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`
            : `${
                disabled
                  ? `${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} cursor-not-allowed`
                  : `${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} hover:border-gray-400`
              }`
        }`}
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap gap-1 flex-1 mr-2">
          {selectedValues.length === 0 ? (
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {placeholder}
            </span>
          ) : (
            selectedValues.map((value) => (
              <div
                key={value}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-sm ${
                  darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate">{value}</span>
                <button
                  type="button"
                  onClick={(e) => removeOption(value, e)}
                  className={`flex items-center justify-center w-4 h-4 rounded-full ${
                    darkMode
                      ? 'hover:bg-blue-700 focus:bg-blue-700'
                      : 'hover:bg-blue-200 focus:bg-blue-200'
                  }`}
                  aria-label={`Remove ${value}`}
                >
                  <XCircleIcon className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="flex-shrink-0">
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            } ${
              disabled
                ? 'text-gray-400'
                : darkMode
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full mt-1 overflow-hidden border rounded-md shadow-lg ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-300'
          }`}
        >
          {/* Search input */}
          <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <input
              ref={searchInputRef}
              type="text"
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Cari opsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div
            className={`max-h-60 overflow-y-auto ${
              darkMode ? 'scrollbar-dark' : 'scrollbar-light'
            }`}
          >
            {filteredOptions.length === 0 ? (
              <div
                className={`p-3 text-center ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {searchTerm
                  ? 'Tidak ada opsi yang cocok'
                  : selectedValues.length === options.length
                  ? 'Semua opsi telah dipilih'
                  : 'Tidak ada opsi tersedia'}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer ${
                    darkMode
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => handleToggleOption(option)}
                >
                  {option}
                </div>
              ))
            )}
          </div>

          {/* Selected items count */}
          {selectedValues.length > 0 && (
            <div
              className={`py-2 px-3 text-xs border-t ${
                darkMode
                  ? 'border-gray-700 text-gray-400'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              {selectedValues.length} opsi dipilih
            </div>
          )}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValues.join(',')} />
    </div>
  );
};

export default MultiSelectDropdown;