// src/services/survey/types.ts

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SurveySession {
  _id: string;
  user_id: string;
  status: "IN_PROGRESS" | "COMPLETED";
  responses: Array<{
    question_code: string;
    valid_response: string | number | string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitResponseRequest {
  question_code: string;
  valid_response: string | number | string[];
}
