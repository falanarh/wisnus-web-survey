import { getToken } from "../auth";
import { ApiResponse, SubmitResponseRequest, SurveySession } from "./types";

export const startSurveySession = async (): Promise<
  ApiResponse<SurveySession>
> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to start survey session");
    }

    return data;
  } catch (error) {
    console.error("Error starting survey session:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to start survey session",
    };
  }
};

export const submitSurveyResponse = async (
  sessionId: string,
  data: SubmitResponseRequest
): Promise<ApiResponse<SurveySession>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-sessions/${sessionId}/submit-response`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to submit response");
    }

    return responseData;
  } catch (error) {
    console.error("Error submitting response:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to submit response",
    };
  }
};

export const getSurveySession = async (
  sessionId: string
): Promise<ApiResponse<SurveySession>> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/survey-sessions/${sessionId}`,
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
      throw new Error(data.message || "Failed to fetch survey session");
    }

    return data;
  } catch (error) {
    console.error("Error fetching survey session:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch survey session",
    };
  }
};

export const completeSurveySession = async (sessionId: string) => {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/survey-sessions/${sessionId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to complete session");
  return data;
};

export const validateUniqueSurveyCode = async (kodeUnik: string) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/unique-survey-codes/unique-code/${kodeUnik}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to validate code',
    };
  }
};
