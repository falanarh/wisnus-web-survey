import { useState, useEffect, useCallback } from "react";
import {
  EvaluationQuestionItem,
  getEvaluationBySessionId,
  createSurveyEvaluation,
  SurveyEvaluation,
  EvaluationAnswers,
  submitEvaluationAnswer,
} from "@/services/survey/evaluation";
import { evaluationQuestions } from "@/components/survey/evaluation/constants";

interface UseEvaluationProps {
  sessionId?: string;
}

export function useEvaluation({ sessionId }: UseEvaluationProps = {}) {
  const [evaluation, setEvaluation] = useState<SurveyEvaluation | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<EvaluationQuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Load evaluation questions once on mount
  useEffect(() => {
    setQuestions(evaluationQuestions);
  }, []);

  // Initialize or load existing evaluation
  useEffect(() => {
    let isMounted = true;

    async function loadOrInitializeEvaluation() {
      if (!isMounted) return;

      if (!sessionId) {
        setError("Session ID is required to load evaluation.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try to get existing evaluation for the session
        const evaluationResponse = await getEvaluationBySessionId(sessionId);

        if (!isMounted) return;

        // If evaluation exists and is not completed
        if (
          evaluationResponse.success &&
          evaluationResponse.data &&
          !evaluationResponse.data.completed
        ) {
          const existingEvaluation = evaluationResponse.data;
          setEvaluation(existingEvaluation);

          // Calculate completed questions count
          const completedCount = Object.keys(
            existingEvaluation.answers || {}
          ).length;
          setCurrentQuestionIndex(
            Math.min(completedCount, evaluationQuestions.length - 1)
          );
          return;
        }

        // If no evaluation exists or previous one was completed, create new
        if (
          !evaluationResponse.success &&
          evaluationResponse.message ===
            "Survey evaluation not found for this session"
        ) {
          const newEvaluationResponse = await createSurveyEvaluation(sessionId);

          if (!isMounted) return;

          if (newEvaluationResponse.success && newEvaluationResponse.data) {
            setEvaluation(newEvaluationResponse.data);
            setCurrentQuestionIndex(0);
            return;
          }

          throw new Error(
            newEvaluationResponse.message || "Failed to create evaluation"
          );
        }

        // Handle other error cases
        throw new Error(
          evaluationResponse.message || "Failed to load evaluation"
        );
      } catch (err) {
        if (!isMounted) return;

        if (
          err instanceof Error &&
          err.message === "Survey evaluation not found for this session"
        ) {
          const newEvaluationResponse = await createSurveyEvaluation(sessionId);

          if (!isMounted) return;

          if (newEvaluationResponse.success && newEvaluationResponse.data) {
            setEvaluation(newEvaluationResponse.data);
            setCurrentQuestionIndex(0);
            return;
          }
        }

        console.error("Error in evaluation flow:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load evaluation"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrInitializeEvaluation();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Update questions with current values - FIXED to prevent infinite loop
  useEffect(() => {
    if (evaluation && evaluation.answers) {
      // Create a deep copy of questions to compare
      const currentQuestionsJSON = JSON.stringify(questions);

      // Create updated questions with values from evaluation
      const updatedQuestions = evaluationQuestions.map((q) => ({
        ...q,
        value: evaluation.answers[q.id as keyof typeof evaluation.answers],
      }));

      // Only update state if questions have actually changed
      if (JSON.stringify(updatedQuestions) !== currentQuestionsJSON) {
        setQuestions(updatedQuestions);
      }
    }
  }, [evaluation]); // Only depends on evaluation, not questions

  // Submit answer to current question
  const submitQuestionAnswer = useCallback(
    async (questionId: keyof EvaluationAnswers, value: number | string) => {
      if (!evaluation?._id) {
        setError("No active evaluation found");
        return;
      }

      if (evaluation.completed) {
        setError("Cannot modify completed evaluation");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Validate input values
        const validateInput = () => {
          if (questionId === "mental_effort") {
            if (typeof value !== "number" || value < 1 || value > 9) {
              throw new Error("Mental effort rating must be between 1 and 9");
            }
          } else if (questionId === "overall_experience") {
            if (typeof value !== "string" || value.length > 1000) {
              throw new Error(
                "Overall experience must not exceed 1000 characters"
              );
            }
          } else if (typeof value !== "number" || value < 1 || value > 7) {
            throw new Error(
              `${questionId.replace(/_/g, " ")} rating must be between 1 and 7`
            );
          }
        };

        validateInput();

        // Prepare updated answers
        const updatedAnswers: Partial<EvaluationAnswers> = {
          ...evaluation.answers,
          [questionId]: value,
        };

        // Submit to API
        const response = await submitEvaluationAnswer(
          evaluation._id,
          updatedAnswers
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to submit answer");
        }

        // Update local state
        setEvaluation(response.data);

        // Update completion status based on API response
        if (response.data.completed) {
          setIsComplete(true);
          // You might want to trigger any completion UI here
          return;
        }

        // Only move to next question if not complete
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit answer";
        console.error("Error submitting answer:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentQuestionIndex, evaluation, questions.length]
  );

  // Navigate to previous question
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Navigate to a specific question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < evaluationQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  }, []);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress
  const progress =
    evaluation && evaluation.answers
      ? Object.keys(evaluation.answers).length / evaluationQuestions.length
      : 0;

  return {
    evaluation,
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
    isComplete,
    progress,
    submitQuestionAnswer,
    goToPreviousQuestion,
    goToQuestion,
  };
}
