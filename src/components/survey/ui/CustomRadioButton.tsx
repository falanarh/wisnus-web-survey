import React from 'react';
import styled from 'styled-components';

interface CustomRadioGroupProps {
    name: string;
    options?: string[];
    selected: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ name, options = [], selected, onChange }) => {
    if (options.length === 0) {
        return null;
    }
    return (
        <StyledWrapper>
            {options.map((option, index) => (
                <label key={index} className="radio-button">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={selected === option}
                        onChange={onChange}
                    />
                    <span className="radio" />
                    {option}
                </label>
            ))}
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
    align-items: center;
    color: #333;
    font-size: 14px;
    cursor: pointer;
  }

  .radio-button input[type="radio"] {
    position: absolute;
    opacity: 0;
  }

  .radio {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ccc;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
    transform: translateZ(-25px);
    transition: all 0.3s ease-in-out;
  }

  .radio::before {
    position: absolute;
    content: '';
    width: 7px;
    height: 7px;
    top: 3px;
    left: 3px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s ease-in-out;
  }

  .radio-button input[type="radio"]:checked + .radio {
    border-color: #1B56FD;
    transform: translateZ(0px);
    background-color: #1B56FD;
  }

  .radio-button input[type="radio"]:checked + .radio::before {
    opacity: 1;
  }
`;

export default CustomRadioGroup;