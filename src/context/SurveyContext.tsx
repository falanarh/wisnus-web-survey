import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Question } from "@/service/types/Question";
import {
  submitSurveyResponse,
  getSurveySession,
  updateTimeConsumed,
} from "@/services/survey/surveyService";
import { getUserData } from "@/services/auth";
import { surveyQuestions } from "@/components/survey/data/surveyQuestions";
import { characteristicQuestions } from "@/components/survey/data/characteristicQuestions";

interface SurveyContextType {
  answers: Record<string, string>;
  errors: Record<string, string>;
  activeQuestions: Question[];
  updateAnswer: (questionCode: string, value: string) => void;
  updateError: (questionCode: string, errorMessage: string) => void;
  clearError: (questionCode: string) => void;
  isQuestionAnswered: (questionCode: string) => boolean;
  isQuestionValid: (question: Question) => boolean;
  validateQuestion: (question: Question) => boolean;
  getCompletionStatus: () => {
    answered: number;
    blank: number;
    error: number;
    total: number;
  };
  sessionId: string | null;
  isLoading: boolean;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};

interface SurveyProviderProps {
  children: ReactNode;
  initialAnswers?: Record<string, string>;
}

export const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const activeQuestions = useMemo(() => {
    const allQuestions = [...characteristicQuestions, ...surveyQuestions];
    const activeQs: Question[] = [];

    allQuestions.forEach(question => {
      if (!question.depends_on || question.depends_on.length === 0) {
        activeQs.push(question);
        return;
      }

      const isDependentActive = question.depends_on.every((dep: { code: string; value?: string | string[]; value_not?: string | string[]; }) => {
        const parentAnswer = answers[dep.code] || "";
        if (!parentAnswer) return false;

        const parentAnswers = parentAnswer.split(',').map(s => s.trim());

        if (dep.value) {
          const expectedValues = Array.isArray(dep.value) ? dep.value.map(String) : [String(dep.value)];
          return expectedValues.some((val: string) => parentAnswers.includes(val));
        }

        if (dep.value_not) {
          const forbiddenValues = Array.isArray(dep.value_not) ? dep.value_not.map(String) : [String(dep.value_not)];
          return !forbiddenValues.some((val: string) => parentAnswers.includes(val));
        }

        return false;
      });

      if (isDependentActive) {
        activeQs.push(question);
      }
    });

    return activeQs;
  }, [answers]);

  // Load survey session data on mount
  useEffect(() => {
    const userData = getUserData();
    if (userData?.activeSurveySessionId) {
      setSessionId(userData.activeSurveySessionId); // Set sessionId langsung jika ada
    }
    const loadSurveySession = async () => {
      try {
        if (!userData?.activeSurveySessionId) {
          setIsLoading(false);
          return;
        }
        const response = await getSurveySession(userData.activeSurveySessionId);
        if (response.success && response.data) {
          setSessionId(response.data._id);
          // Convert responses to answers format
          const sessionAnswers = response.data.responses.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.question_code]: String(curr.valid_response),
            }),
            {}
          );
          setAnswers(sessionAnswers);
        }
      } catch (error) {
        console.error("Error loading survey session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSurveySession();
  }, []);

  const updateAnswer = async (questionCode: string, value: string) => {
    try {
      setAnswers((prev) => ({
        ...prev,
        [questionCode]: value,
      }));

      // Clear error if exists
      if (errors[questionCode]) {
        clearError(questionCode);
      }

      // Get the question from either survey or characteristic questions
      const question = [...surveyQuestions, ...characteristicQuestions].find(
        (q) => q.code === questionCode
      );

      if (!question) {
        throw new Error("Question not found");
      }

      // --- Tambahan validasi min value untuk text/number ---
      if (
        question.type === "text" &&
        question.validation?.input_type === "number" &&
        question.validation?.min !== undefined &&
        value.trim() !== "Tidak tahu"
      ) {
        const num = Number(value);
        if (num < question.validation.min) {
          updateError(questionCode, `Nilai minimum adalah ${question.validation.min}`);
          return;
        }
      }

      // For text inputs, validate before submitting to API
      if (question.type === "text") {
        const isValid = validateQuestion(question);
        if (!isValid) {
          console.error("Validation failed for question:", questionCode);
          // Don't submit to API if validation fails
          return;
        }
      }

      // --- Perbaikan di sini ---
      let submitValue: string | string[] = value;
      if (question.type === "select" && question.multiple) {
        // MultiSelectDropdown mengirim value string gabungan, ubah ke array
        submitValue = value
          ? value.split(",").map((v) => v.trim()).filter(Boolean)
          : [];
      }

      // Submit to API if session exists and validation passed
      if (sessionId) {
        const response = await submitSurveyResponse(sessionId, {
          question_code: questionCode,
          valid_response: submitValue, // <-- array jika multiselect
        });

        if (!response.success) {
          throw new Error(response.message);
        }

        // Update time consumed after successful answer submission
        try {
          // Get current time consumed from localStorage or use default
          const currentTimeConsumed = (() => {
            if (typeof window !== 'undefined') {
              const stored = localStorage.getItem('timeConsumed');
              if (stored) {
                try {
                  return JSON.parse(stored);
                } catch (e) {
                  console.error('Error parsing timeConsumed from localStorage:', e);
                }
              }
            }
            return { survei: 0, karakteristik: 0 };
          })();

          // Determine which tab the question belongs to
          const isSurveyQuestion = surveyQuestions.some(q => q.code === questionCode);
          const isCharacteristicQuestion = characteristicQuestions.some(q => q.code === questionCode);
          
          if (isSurveyQuestion || isCharacteristicQuestion) {
            const tabKey = isSurveyQuestion ? 'survei' : 'karakteristik';
            const updated = {
              ...currentTimeConsumed,
              [tabKey]: currentTimeConsumed[tabKey] + 1000 // Add 1 second for answering
            };
            
            await updateTimeConsumed(sessionId, updated);
            console.log(`[LOG] Update waktu tab '${tabKey}' karena menjawab pertanyaan:`, updated[tabKey], 'ms');
            
            // Update localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('timeConsumed', JSON.stringify(updated));
            }
          }
        } catch (timeError) {
          console.error('Error updating time consumed:', timeError);
          // Don't throw error for time tracking failure
        }
      }
    } catch (error) {
      console.error("Error updating answer:", error);
      // Only revert state if API call failed (not validation error)
      if (sessionId) {
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionCode];
          return newAnswers;
        });
      }
      updateError(
        questionCode,
        error instanceof Error ? error.message : "Failed to save response"
      );
      throw error;
    }
  };

  const updateError = (questionCode: string, errorMessage: string) => {
    setErrors((prev) => {
      // If error already exists with same message, don't update to prevent loops
      if (prev[questionCode] === errorMessage) {
        return prev;
      }
      return {
        ...prev,
        [questionCode]: errorMessage,
      };
    });
  };

  const clearError = (questionCode: string) => {
    setErrors((prev) => {
      // If error doesn't exist, don't update to prevent loops
      if (!prev[questionCode]) {
        return prev;
      }

      const newErrors = { ...prev };
      delete newErrors[questionCode];
      return newErrors;
    });
  };

  const isQuestionAnswered = (questionCode: string) => {
    return !!answers[questionCode] && answers[questionCode].trim() !== "";
  };

  const validateQuestion = (question: Question): boolean => {
    const { code, validation, type } = question;
    const value = answers[code] || "";

    // Check required validation
    if (validation.required && !value.trim()) {
      updateError(code, "Bidang ini wajib diisi");
      console.error("Validation failed: required field is empty", code);
      return false;
    }

    // If not required and empty, it's valid
    if (!value.trim()) {
      clearError(code);
      return true;
    }

    // Check pattern validation
    if (validation.pattern && value.trim()) {
      // Special case for phone number validation
      if (code === "S001" || code.toLowerCase().includes("handphone")) {
        // Indonesian phone number validation
        const phoneRegex = /^(0[0-9]{7,14}|\+62[0-9]{7,12})$/;
        if (!phoneRegex.test(value)) {
          updateError(
            code,
            'Masukkan nomor handphone yang valid. Nomor harus diawali "0" atau "+62" dan terdiri dari 8–15 digit.'
          );
          console.error("Validation failed: invalid phone number format", code);
          return false;
        }
      } else {
        try {
          if (!new RegExp(validation.pattern).test(value)) {
            updateError(code, "Nilai tidak sesuai format");
            console.error("Validation failed: invalid format", code, value);
            return false;
          }
        } catch (e) {
          console.error("Invalid regex pattern:", validation.pattern, e);
          // Even if the regex is invalid, we don't want to block the form submission
        }
      }
    }

    // Check min validation for number inputs
    if (
      type === "text" &&
      validation.input_type === "number" &&
      validation.min !== undefined &&
      Number(value) < validation.min
    ) {
      updateError(code, `Nilai minimum adalah ${validation.min}`);
      console.error("Validation failed: minimum value not met", code, value);
      return false;
    }

    // Check max validation for number inputs
    if (
      type === "text" &&
      validation.input_type === "number" &&
      validation.max !== undefined &&
      Number(value) > validation.max
    ) {
      updateError(code, `Nilai maksimum adalah ${validation.max}`);
      console.error("Validation failed: maximum value exceeded", code, value);
      return false;
    }

    // If multiple choices (comma-separated values), check minimum selection for multiple select
    if (
      type === "select" &&
      question.multiple &&
      question.instruction?.includes("Paling sedikit")
    ) {
      const selectedCount = value.split(",").filter((v) => v.trim()).length;
      const requiredCount = 2; // Default value from the instruction

      if (selectedCount < requiredCount) {
        updateError(code, `Pilih minimal ${requiredCount} opsi`);
        return false;
      }
    }

    // Remove error if validation passes
    clearError(code);

    return true;
  };

  const isQuestionValid = (question: Question): boolean => {
    const { code } = question;
    return !errors[code];
  };

  const getCompletionStatus = () => {
    // Count would need to be based on the actual questions in the survey
    // This is a placeholder implementation
    const totalQuestions = Object.keys(answers).length;
    const answeredQuestions = Object.keys(answers).filter(
      (key) => answers[key] && answers[key].trim() !== ""
    ).length;
    const errorQuestions = Object.keys(errors).length;

    return {
      answered: answeredQuestions,
      blank: totalQuestions - answeredQuestions,
      error: errorQuestions,
      total: totalQuestions,
    };
  };

  const contextValue = {
    answers,
    errors,
    updateAnswer,
    updateError,
    clearError,
    isQuestionAnswered,
    isQuestionValid,
    validateQuestion,
    getCompletionStatus,
    sessionId,
    isLoading,
    activeQuestions,
  };

  return (
    <SurveyContext.Provider value={contextValue}>
      {children}
    </SurveyContext.Provider>
  );
};
