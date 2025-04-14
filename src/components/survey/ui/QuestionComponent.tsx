import React, { useState, useMemo } from "react";
import { Question as QuestionType } from "@/service/types/Question";
import CustomRadioGroup from "./CustomRadioButton";
import CustomTextInput from "./CustomTextInput";
import LocationDropdown from "./LocationDropdown";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useSurvey } from "@/context/SurveyContext";
import { getCurrentMonthYear, replacePlaceholders } from "@/utils/functions";
import CustomDropdown from "./CustomDropdown";

const ADDITIONAL_INFO_CODES = [
  "KR004",
  "KR005",
  "KR006",
  "S009",
  "S011",
  "S015",
  "S021",
  "S023",
  "S024",
  "S028",
  "S029",
];
const PROVINCE_QUESTION_CODES = ["S002", "S004"];
const REGENCY_QUESTION_CODES = ["S003", "S005"];

interface QuestionProps {
  question: QuestionType;
  darkMode: boolean;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, darkMode }) => {
  const { answers, updateAnswer } = useSurvey();
  const [loading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    code,
    text,
    type,
    options,
    validation,
    additional_info,
    instruction,
    multiple,
  } = question;

  // Filter options for S006 (bulan) to only include months up to the current month
  const filteredOptions = useMemo(() => {
    if (code === "S006" && Array.isArray(options)) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-11

      return options.filter((option) => {
        if (typeof option === "string") {
          // Parse the month option (format: "Bulan YYYY")
          const parts = option.split(" ");
          if (parts.length >= 2) {
            const monthNames = [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ];
            const monthIndex = monthNames.indexOf(parts[0]);
            const year = parseInt(parts[1], 10);

            // Check if the month is in the past or current month
            if (year < currentYear) {
              return true;
            } else if (year === currentYear) {
              return monthIndex <= currentMonth;
            }
            return false;
          }
        }
        return true;
      });
    }
    return options;
  }, [code, options]);

  // Get available months for S007 from S006 answer
  const getAvailableMonths = useMemo(() => {
    if (code === "S007" && answers["S006"]) {
      return answers["S006"].split(",").filter((item) => item.trim() !== "");
    }
    return [];
  }, [code, answers["S006"]]);

  // Check if S007 should be disabled
  const isS007Disabled = useMemo(() => {
    return (
      code === "S007" && (!answers["S006"] || answers["S006"].trim() === "")
    );
  }, [code, answers["S006"]]);

  // Get the related province question code for this regency question
  const getRelatedProvinceQuestionCode = () => {
    if (code === "S003") return "S002";
    if (code === "S005") return "S004";
    return null;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSubmitError(null); // Clear previous submit error

    try {
      await updateAnswer(question.code, newValue);
    } catch (error) {
      // Only show submit error if it's not a validation error
      if (error instanceof Error && !error.message.includes('validation')) {
        setSubmitError(error.message);
      }
    }
  };

  const renderAdditionalInfo = () => {
    if (!additional_info) return null;

    const lines = additional_info.split("\n");
    const firstLine = lines[0];
    const listItems = lines.slice(1);

    return (
      <>
        {validation.required && (
          <span className="text-red-500 ml-[5px]">*</span>
        )}
        <div
          className={`text-sm font-semibold ${
            darkMode ? "text-gray-400" : "text-[#565656]"
          } my-2`}
        >
          <p>{firstLine}</p>
          {listItems.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {listItems.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  };

  // Get placeholder text based on question code
  const getPlaceholder = () => {
    if (code === "S002") return "Pilih provinsi tempat tinggal";
    if (code === "S004") return "Pilih provinsi yang dikunjungi";
    if (code === "S003") return "Pilih kabupaten/kota tempat tinggal";
    if (code === "S005") return "Pilih kabupaten/kota yang dikunjungi";
    if (code === "S006") return "Pilih bulan perjalanan";
    if (code === "S007") return "Pilih salah satu bulan perjalanan";
    if (code === "S017") return "Pilih satu atau lebih kegiatan";
    if (code === "S013") return "Pilih satu atau lebih paket wisata";
    if (multiple) return `Pilih satu atau lebih ${text.toLowerCase()}`;
    return `Pilih ${text.toLowerCase()}`;
  };

  // Render location dropdown or standard input based on question type
  const renderInput = () => {
    // For province and regency questions, use the specialized LocationDropdown component
    if (
      (PROVINCE_QUESTION_CODES.includes(code) ||
        REGENCY_QUESTION_CODES.includes(code)) &&
      type === "select"
    ) {
      return (
        <LocationDropdown
          questionCode={code}
          darkMode={darkMode}
          placeholder={getPlaceholder()}
          relatedProvinceQuestionCode={getRelatedProvinceQuestionCode()}
        />
      );
    }

    // For S007 (month selection based on S006)
    if (code === "S007") {
      return (
        <>
          {isS007Disabled && (
            <div
              className={`mb-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } italic`}
            >
              Silakan pilih bulan perjalanan pada pertanyaan sebelumnya
            </div>
          )}
          <CustomDropdown
            name={code}
            options={getAvailableMonths}
            selected={answers[code] || ""}
            onChange={handleChange}
            darkMode={darkMode}
            placeholder={getPlaceholder()}
            disabled={isS007Disabled}
          />
        </>
      );
    }

    // For select questions with multiple selection
    if (type === "select" && multiple && filteredOptions) {
      return (
        <MultiSelectDropdown
          name={code}
          options={
            Array.isArray(filteredOptions)
              ? filteredOptions.map((opt) =>
                  typeof opt === "string" ? opt : opt.text
                )
              : []
          }
          value={answers[code] || ""}
          onChange={handleChange}
          darkMode={darkMode}
          placeholder={getPlaceholder()}
        />
      );
    }

    // For standard select questions (single selection)
    if (type === "select" && filteredOptions) {
      return (
        <CustomRadioGroup
          name={code}
          options={filteredOptions}
          selected={answers[code] || ""}
          onChange={handleChange}
          multiple={false}
          darkMode={darkMode}
        />
      );
    }

    // For text input questions
    if (type === "text") {
      return (
        <CustomTextInput
          name={code}
          type={validation.input_type || "text"}
          placeholder={`Masukkan ${text.toLowerCase()}`}
          darkMode={darkMode}
          value={answers[code] || ""}
          onChange={handleChange}
          min={validation.min}
          max={validation.max}
          pattern={validation.pattern}
          required={validation.required}
        />
      );
    }

    return null;
  };

  const replacement = {
    kabkot: answers["S005"] ? answers["S005"] : "Kabupaten/Kota",
    bulan: answers["S007"] ? answers["S007"] : "yang dipilih",
    currentMonth: getCurrentMonthYear(),
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      {/* Question Section */}
      <div className="w-full md:w-1/3 dark:text-gray-300">
        <span
          className={`font-bold ${
            darkMode ? "text-gray-200" : "text-[#565656]"
          }`}
        >
          {replacePlaceholders(text, replacement)}
        </span>

        {additional_info && (
          <>
            {!ADDITIONAL_INFO_CODES.includes(code) && (
              <span
                className={`text-sm font-semibold ml-[5px] ${
                  darkMode ? "text-gray-400" : "text-[#565656]"
                } my-2`}
              >
                {"(" + additional_info + ")"}
                {validation.required && (
                  <span className="text-red-500 ml-[5px]">*</span>
                )}
              </span>
            )}
            {ADDITIONAL_INFO_CODES.includes(code) && renderAdditionalInfo()}
          </>
        )}

        {!additional_info && validation.required && (
          <span className="text-red-500 ml-[5px]">*</span>
        )}

        {instruction && (
          <div
            className={`mt-1 text-xs italic ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {instruction}
          </div>
        )}

        {code === "S006" && (
          <div
            className={`mt-1 text-xs italic ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            *Hanya menampilkan bulan hingga saat ini
          </div>
        )}
      </div>

      {/* Answer Section */}
      <div className="flex-1">
        {loading && (
          <div
            className={`py-4 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Memuat data...</span>
            </div>
          </div>
        )}

        {submitError && (
          <div className="text-red-500 text-sm mt-2">
            {submitError}
          </div>
        )}

        {loading && (
          <div className="text-blue-500 text-sm mt-2">
            Menyimpan...
          </div>
        )}

        {/* {error && (
          <div className="py-4 text-sm text-red-500">
            Error: {error}
            <button
              className="ml-2 text-blue-500 underline"
              onClick={() => window.location.reload()}
            >
              Muat ulang
            </button>
          </div>
        )} */}

        {!loading && renderInput()}
      </div>
    </div>
  );
};

export default QuestionComponent;
