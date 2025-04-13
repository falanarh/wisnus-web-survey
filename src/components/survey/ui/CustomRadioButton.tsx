"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

interface OptionType {
  text: string;
  additional_info?: string;
}

interface CustomRadioGroupProps {
  name: string;
  options?: Array<string | OptionType>;
  selected: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  darkMode?: boolean;
}

// Create a styled wrapper component
const RadioWrapper = styled.div<{ $darkMode: boolean }>`
  .radio-button {
    display: flex;
    gap: 16px; 
    justify-content: flex-start;
    margin: 8px 0;
    position: relative;
    align-items: flex-start;
    color: ${props => props.$darkMode ? '#e5e7eb' : '#565656'};
    font-size: 14px;
    cursor: pointer;

    @media (min-width: 768px) {
      gap: 40px; 
    }
  }

  .radio-button input[type="radio"],
  .radio-button input[type="checkbox"] {
    position: absolute;
    opacity: 0;
  }

  .radio {
    position: relative;
    display: inline-block;
    width: 18px;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${props => props.$darkMode ? '#4b5563' : '#ccc'};
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
    transform: translateZ(-25px);
    transition: all 0.3s ease-in-out;
    margin-top: 2px;
  }

  .checkbox {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid ${props => props.$darkMode ? '#4b5563' : '#ccc'};
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
    transform: translateZ(-25px);
    transition: all 0.3s ease-in-out;
    margin-top: 2px;
  }

  .radio::before,
  .checkbox::before {
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    top: 2px;
    left: 2px;
    border-radius: 100%;
    background-color: #fff;
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .checkbox::before {
    transform: rotate(45deg);
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    width: 6px;
    height: 9px;
    top: 1px;
    left: 5px;
  }

  .radio-button input[type="radio"]:checked + .radio,
  .radio-button input[type="checkbox"]:checked + .checkbox {
    border-color: ${props => props.$darkMode ? '#3b82f6' : '#1B56FD'};
    transform: translateZ(0px);
    background-color: ${props => props.$darkMode ? '#3b82f6' : '#1B56FD'};
  }

  .radio-button input[type="radio"]:checked + .radio::before,
  .radio-button input[type="checkbox"]:checked + .checkbox::before {
    opacity: 1;
  }
  
  .option-content {
    display: flex;
    flex-direction: column;
  }
  
  .option-text {
    margin-right: 8px;
  }
  
  .option-info {
    font-size: 12px;
    color: ${props => props.$darkMode ? '#9ca3af' : '#888'};
    margin-top: 4px;
  }
`;

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  options = [],
  selected,
  onChange,
  multiple = false,
  darkMode = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    selected ? selected.split(',') : []
  );

  if (options.length === 0) {
    return null;
  }

  // Handle multiple selections
  const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newSelectedOptions: string[];

    if (e.target.checked) {
      // Add the option if checked
      newSelectedOptions = [...selectedOptions, value];
    } else {
      // Remove the option if unchecked
      newSelectedOptions = selectedOptions.filter(option => option !== value);
    }

    setSelectedOptions(newSelectedOptions);

    // Create a synthetic event to pass to the parent's onChange handler
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: newSelectedOptions.join(','),
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <RadioWrapper $darkMode={darkMode}>
      {options.map((option, index) => {
        const isObjectOption = typeof option === 'object' && option !== null;
        const optionValue = isObjectOption ? (option as OptionType).text : option as string;
        const additionalInfo = isObjectOption ? (option as OptionType).additional_info : undefined;
        
        return (
          <label key={index} className="radio-button">
            {multiple ? (
              <input
                type="checkbox"
                name={name}
                value={optionValue}
                checked={selectedOptions.includes(optionValue)}
                onChange={handleMultipleChange}
              />
            ) : (
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={selected === optionValue}
                onChange={onChange}
              />
            )}
            <span className={multiple ? "checkbox" : "radio"} />
            <div className="option-content">
              <span className="option-text">{optionValue}</span>
              {additionalInfo && (
                <span className="option-info">{additionalInfo}</span>
              )}
            </div>
          </label>
        );
      })}
    </RadioWrapper>
  );
};

export default CustomRadioGroup;