import { getToken } from "@/services/auth";
import { ApiResponse, EvaluationAnswers, SurveyEvaluation } from "./types";

/**
 * Get survey evaluation by session ID
 * @param sessionId The survey session ID
 * @returns Promise with the evaluation data
 */
export const getEvaluationBySessionId = async (
  sessionId: string
): Promise<ApiResponse<SurveyEvaluation>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-evaluations/by-session/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch evaluation");
    }

    return data;
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch evaluation",
    };
  }
};

/**
 * Check if a survey session has an evaluation
 * @param sessionId The survey session ID
 * @returns Promise<boolean>
 */
export const hasEvaluation = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await getEvaluationBySessionId(sessionId);
    return response.success && Boolean(response.data);
  } catch {
    return false;
  }
};

/**
 * Create a new survey evaluation
 * @param sessionId The survey session ID to evaluate
 * @returns Promise with the created evaluation data
 */
export const createSurveyEvaluation = async (
  sessionId: string
): Promise<ApiResponse<SurveyEvaluation>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-evaluations/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create evaluation");
    }

    return data;
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create evaluation",
    };
  }
};

export const submitEvaluationAnswer = async (
  evaluationId: string,
  answers: Partial<EvaluationAnswers>
): Promise<ApiResponse<SurveyEvaluation>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-evaluations/${evaluationId}/submit-answer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit evaluation answer");
    }

    return data;
  } catch (error) {
    console.error("Error submitting evaluation answer:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit evaluation answer",
    };
  }
};
