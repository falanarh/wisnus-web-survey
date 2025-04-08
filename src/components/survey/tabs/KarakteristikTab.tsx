// components/KarakteristikTab.tsx
import React, { useState } from 'react';
import CustomRadioGroup from '../ui/CustomRadioButton';
import { Question } from '@/service/types/Question';

interface KarakteristikTabProps {
  darkMode: boolean;
}

const KarakteristikTab: React.FC<KarakteristikTabProps> = ({ darkMode }) => {
  // const question1 = {
  //   code: "KR001",
  //   text: "Jenis kelamin",
  //   type: "select",
  //   multiple: false,
  //   options: ["Laki-laki", "Perempuan"],
  //   validation: {
  //     required: true
  //   }
  // };

  const question1 = {
    code: "KR002",
    text: "Usia",
    type: "text",
    unit: "tahun",
    additional_info: "Berdasarkan ulang tahun terakhir",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
      max: 120
    }
  } as Question;

  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className={`p-5 md:p-7 rounded-md`}>
      <div className="w-full h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Question Section */}
          <div className="w-1/3 text-[#565656]">
            <span className='font-extrabold'>
              {question1.text}
            </span>
            {question1.additional_info && (
              <span className="text-[#565656] text-sm font-semibold ml-[5px]">{"(" + question1.additional_info + ")"}</span>
            )}
            {question1.validation.required && (
              <span className="text-red-500 ml-[5px]">*</span>
            )}
          </div>

          {/* Answer Section */}
          <div className="flex-1">
            {question1.type === "select" && question1.options && (
              <CustomRadioGroup
                name={question1.code}
                options={question1.options}
                selected={selectedOption}
                onChange={handleChange}
              />
            )}

            {question1.type === "text" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
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
                  placeholder="Masukkan usia"
                  min={question1.validation.min}
                  max={question1.validation.max}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarakteristikTab;
