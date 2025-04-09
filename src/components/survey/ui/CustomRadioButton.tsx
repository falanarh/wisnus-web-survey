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
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ name, options = [], selected, onChange, multiple }) => {
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
    <StyledWrapper>
      {options.map((option, index) => {
        // Determine if this is a string option or an object option
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
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .radio-button {
    display: flex;
    gap: 40px;
    justify-content: flex-start;
    margin: 8px 0;
    position: relative;
    align-items: flex-start;
    color: #565656;
    font-size: 14px;
    cursor: pointer;
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
    height: 18px;
    border-radius: 50%;
    border: 2px solid #ccc;
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
    border: 2px solid #ccc;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
    transform: translateZ(-25px);
    transition: all 0.3s ease-in-out;
    margin-top: 2px;
  }

  .radio::before {
    position: absolute;
    content: '';
    width: 7px;
    height: 7px;
    top: 4px;
    left: 4px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .checkbox::before {
    position: absolute;
    content: '';
    width: 10px;
    height: 10px;
    top: 2px;
    left: 2px;
    background-color: #fff;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    transform: rotate(45deg);
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    width: 6px;
    height: 9px;
    top: 1px;
    left: 5px;
  }

  .radio-button input[type="radio"]:checked + .radio {
    border-color: #1B56FD;
    transform: translateZ(0px);
    background-color: #1B56FD;
  }

  .radio-button input[type="checkbox"]:checked + .checkbox {
    border-color: #1B56FD;
    transform: translateZ(0px);
    background-color: #1B56FD;
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
    color: #888;
    margin-top: 4px;
  }
`;

export default CustomRadioGroup;