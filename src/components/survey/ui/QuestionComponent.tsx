import React, { useState, useMemo, useRef } from "react";
import { Question as QuestionType } from "@/service/types/Question";
import CustomRadioGroup from "./CustomRadioButton";
import CustomTextInput from "./CustomTextInput";
import LocationDropdown from "./LocationDropdown";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useSurvey } from "@/context/SurveyContext";
import { getCurrentMonthYear, replacePlaceholders } from "@/utils/functions";
import CustomDropdown from "./CustomDropdown";
import CustomRadioButton from "./CustomRadioButton"; // pastikan path sesuai
import { updateTimeOnAnswer } from '../WebSurvey';

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
const FLEXIBLE_QUESTION_CODES = [
  "S009",
  "S013",
  "S014",
  "S017",
  "S019",
  "S020",
  "S021",
  "S022",
  "S023",
  "S024",
  "S025",
  "S026",
  "S027",
  "S028",
  "S029",
]; // sesuaikan

interface QuestionProps {
  question: QuestionType;
  darkMode: boolean;
}

// Fungsi format angka ribuan
function formatNumberWithDots(value: string): string {
  if (!value) return "";
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, darkMode }) => {
  const { answers, updateAnswer, errors, updateError, clearError, sessionId, timeConsumed, setTimeConsumed, lastSwitchTime, activeTab } = useSurvey();
  const [rawValue, setRawValue] = useState(answers[question.code] || "");
  const [displayValue, setDisplayValue] = useState(formatNumberWithDots(answers[question.code] || ""));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const multiSelectDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const isFLEXIBLEQuestion = FLEXIBLE_QUESTION_CODES.includes(question.code);
  const isTidakTahu = (answers[question.code] || "") === "Tidak tahu";
  // const isTextFilled = answers[question.code] && answers[question.code] !== "Tidak tahu";

  React.useEffect(() => {
    if (isInputFocused || isEditing) return; // Jangan sinkronisasi jika user sedang mengetik atau perubahan sedang diproses

    const isNumeric = question.type === 'text' && question.validation?.input_type === 'number';
    const globalAnswer = answers[question.code] || "";

    if (globalAnswer === "Tidak tahu") {
      setRawValue("");
      setDisplayValue("");
    } else {
      setRawValue(globalAnswer);
      if (isNumeric) {
        setDisplayValue(formatNumberWithDots(globalAnswer));
      } else {
        setDisplayValue(globalAnswer);
      }
    }
  }, [answers[question.code], isInputFocused, isEditing, question.type, question.validation]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true); // Kunci input
    const isNumeric = question.validation?.input_type === 'number';
    const inputValue = e.target.value;
    setSubmitError(null);

    if (isNumeric) {
      const onlyDigits = inputValue.replace(/\D/g, "");
      setRawValue(onlyDigits);
      setDisplayValue(formatNumberWithDots(onlyDigits));

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        if (onlyDigits === "") {
          clearError(question.code);
          if (answers[question.code] !== "") {
            try {
              await updateAnswer(question.code, "");
              if (activeTab === 'survei' || activeTab === 'karakteristik') {
                await updateTimeOnAnswer(
                  activeTab,
                  sessionId,
                  timeConsumed,
                  setTimeConsumed,
                  lastSwitchTime
                );
              }
            } catch (error: unknown) {
              if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
              else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
            }
          }
          return;
        }
        
        const value = parseInt(onlyDigits, 10);
        const { min, max } = question.validation;
        if (min !== undefined && value < min) {
          updateError(question.code, `Nilai minimal adalah ${min}.`);
          return;
        }
        if (max !== undefined && value > max) {
          updateError(question.code, `Nilai maksimal adalah ${max}.`);
          return;
        }
        
        clearError(question.code);
        const cleanedValue = value.toString();

        if (cleanedValue !== answers[question.code]) {
          setIsSaving(true);
          try {
            await updateAnswer(question.code, cleanedValue);
            setRawValue(cleanedValue);
            setDisplayValue(formatNumberWithDots(cleanedValue));
            if (activeTab === 'survei' || activeTab === 'karakteristik') {
              await updateTimeOnAnswer(
                activeTab,
                sessionId,
                timeConsumed,
                setTimeConsumed,
                lastSwitchTime
              );
            }
          } catch (error: unknown) {
            if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
            else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
          } finally {
            setIsSaving(false);
            setIsEditing(false); // Buka kunci
          }
        }
      }, 4000);
    } else { // Free text input
      setRawValue(inputValue);
      setDisplayValue(inputValue);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        if (inputValue !== answers[question.code]) {
          setIsSaving(true);
          try {
            await updateAnswer(question.code, inputValue);
            if (activeTab === 'survei' || activeTab === 'karakteristik') {
              await updateTimeOnAnswer(
                activeTab,
                sessionId,
                timeConsumed,
                setTimeConsumed,
                lastSwitchTime
              );
            }
          } catch (error: unknown) {
            if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
            else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
          } finally {
            setIsSaving(false);
            setIsEditing(false); // Buka kunci
          }
        }
      }, 4000);
    }
  };

  // Untuk radio "Tidak tahu": submit langsung, kosongkan input lokal
  const handleTidakTahu = async () => {
    setIsEditing(true); // Kunci input
    setRawValue(""); // kosongkan input lokal
    setDisplayValue(""); // kosongkan tampilan input
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsSaving(true);
    setSubmitError(null);
    try {
      await updateAnswer(question.code, "Tidak tahu");
      if (activeTab === 'survei' || activeTab === 'karakteristik') {
        await updateTimeOnAnswer(
          activeTab,
          sessionId,
          timeConsumed,
          setTimeConsumed,
          lastSwitchTime
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
      else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
    } finally {
      setIsSaving(false);
      setIsEditing(false); // Buka kunci
    }
  };

  // Untuk pilihan (radio/checkbox/dropdown): submit langsung
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditing(true); // Kunci input
    const newValue = e.target.value;
    setSubmitError(null);
    setIsSaving(true);
    try {
      await updateAnswer(question.code, newValue);
      if (activeTab === 'survei' || activeTab === 'karakteristik') {
        await updateTimeOnAnswer(
          activeTab,
          sessionId,
          timeConsumed,
          setTimeConsumed,
          lastSwitchTime
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
      else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
    } finally {
      setIsSaving(false);
      setIsEditing(false); // Buka kunci
    }
  };

  // Handler debounce internal untuk multi-select
  const handleMultiSelectDebounced = (value: string) => {
    setIsEditing(true); // Kunci input
    setRawValue(value);
    setSubmitError(null);
    if (multiSelectDebounceTimer.current) clearTimeout(multiSelectDebounceTimer.current);
    multiSelectDebounceTimer.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateAnswer(question.code, value);
        if (activeTab === 'survei' || activeTab === 'karakteristik') {
          await updateTimeOnAnswer(
            activeTab,
            sessionId,
            timeConsumed,
            setTimeConsumed,
            lastSwitchTime
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error && !errors[question.code] && error.message !== 'Failed to fetch') setSubmitError(error.message || "Gagal menyimpan jawaban");
        else if (!errors[question.code]) setSubmitError("Gagal menyimpan jawaban");
      } finally {
        setIsSaving(false);
        setIsEditing(false); // Buka kunci
      }
    }, 4000);
  };

  // Handler event untuk MultiSelectDropdown
  const handleMultiSelectChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMultiSelectDebounced(e.target.value);
  };

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
          value={isTidakTahu ? "" : rawValue}
          onChange={handleMultiSelectChangeEvent}
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
      // Jika input numerik, jangan kirim pattern agar format ribuan bisa tampil
      const isNumeric = validation.input_type === "number";
      if (isNumeric) {
        return (
          <CustomTextInput
            name={code}
            placeholder={`Masukkan ${text.toLowerCase()}`}
            darkMode={darkMode}
            value={displayValue}
            onChange={handleTextChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            min={validation.min}
            max={validation.max}
            required={validation.required}
          />
        );
      } else {
        return (
          <CustomTextInput
            name={code}
            placeholder={`Masukkan ${text.toLowerCase()}`}
            darkMode={darkMode}
            value={rawValue === undefined || rawValue === null ? "" : rawValue}
            onChange={handleTextChange}
            min={validation.min}
            max={validation.max}
            required={validation.required}
          />
        );
      }
    }

    return null;
  };

  const replacement = {
    kabkot: answers["S005"] ? answers["S005"] : "Kabupaten/Kota",
    bulan: answers["S007"] ? answers["S007"] : "yang dipilih",
    currentMonth: getCurrentMonthYear(),
  };

  return (
    <>
      {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
      {isFLEXIBLEQuestion ? (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <label className="font-semibold w-full md:w-1/3 dark:text-gray-300">
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
          </label>
          <div className="flex-1">
            { question.type === "text" && (<CustomTextInput
              name={question.code}
              placeholder={
                question.code === "S009"
                  ? "Masukkan jumlah malam"
                  : "Masukkan nominal (Rp)"
              }
              darkMode={darkMode}
              value={displayValue}
              onChange={handleTextChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              min={question.validation?.min}
              max={question.validation?.max}
              required={question.validation?.required}
            />)}

            {question.type === "select" && multiple && filteredOptions && (
              <MultiSelectDropdown
                name={code}
                options={
                  Array.isArray(filteredOptions)
                    ? filteredOptions.map((opt) =>
                        typeof opt === "string" ? opt : opt.text
                      )
                    : []
                }
                value={isTidakTahu ? "" : rawValue}
                onChange={handleMultiSelectChangeEvent}
                darkMode={darkMode}
                placeholder={getPlaceholder()}
              />
            )}
            {errors[question.code] && (
              <div className="text-red-500 text-sm mt-2">
                {errors[question.code]}
              </div>
            )}
            <CustomRadioButton
              name={question.code}
              options={["Tidak tahu"]}
              selected={isTidakTahu ? "Tidak tahu" : ""}
              onChange={handleTidakTahu}
              multiple={false}
              darkMode={darkMode}
            />
          </div>
        </div>
      ) : (
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
            {/* Feedback visual saat saving */}
            {isSaving && (
              <div className="text-blue-500 text-sm mt-2">Menyimpan...</div>
            )}
            {!isSaving && renderInput()}
          </div>
        </div>
      )}
      {errors[question.code] && (
        <div className="text-red-500 text-sm mt-2">
          {errors[question.code]}
        </div>
      )}
    </>
  );
};

export default QuestionComponent;
