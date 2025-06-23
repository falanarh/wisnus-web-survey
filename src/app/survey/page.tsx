"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/other/ProtectedRoute";
import WebSurvey from "@/components/survey/WebSurvey";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";

const WebSurveyPage = () => {
  const router = useRouter();
  const { isLoading, sessionData } = useSurveyStatus();

  useEffect(() => {
    if (!isLoading && sessionData && sessionData.status === "COMPLETED") {
      router.replace("/survey/completed");
    }
  }, [isLoading, sessionData, router]);

  // Jangan render survey jika sudah completed, atau masih loading
  if (isLoading || (sessionData && sessionData.status === "COMPLETED")) {
    return null;
  }

  return (
    <ProtectedRoute>
      <WebSurvey />
    </ProtectedRoute>
  );
};

export default WebSurveyPage;
