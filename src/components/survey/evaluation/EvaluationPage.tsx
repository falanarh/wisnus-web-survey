"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CompletionScreen from "./CompletionScreen";
import QuestionHeader from "./QuestionHeader";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import Footer from "./Footer";
import { getUserData } from "@/services/auth";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import Loader from "@/components/other/Loader";

const EvaluationPage: React.FC = () => {
  // Get session ID from user data if available
  const userData = getUserData();
  const sessionId = userData?.activeSurveySessionId;
  
  // Use the survey status hook to check if survey is completed
  const { isLoading: isStatusLoading, sessionData } = useSurveyStatus(true);
  
  const {
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
    isComplete,
    questions,
    submitQuestionAnswer,
    goToPreviousQuestion
  } = useEvaluation({ sessionId });

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Keep track of currently selected value before submitting
  const [selectedValue, setSelectedValue] = useState<number | string | undefined>(undefined);

  // Handle answer selection for both numeric and text inputs
  const handleAnswerSelect = (value: number | string) => {
    // We don't need to update local state since useEvaluation handles this
    // Just storing the selected value temporarily until "Next" is clicked
    setSelectedValue(value);
  };

  // Reset selected value when question changes
  React.useEffect(() => {
    // Check if currentQuestion exists and has an id before accessing
    if (currentQuestion && currentQuestion.id) {
      // Use the answers from the evaluation hook if available
      const currentValue = currentQuestion.value; // Already undefined if not present
      setSelectedValue(currentValue);
    }
  }, [currentQuestion]);

  const handleNext = () => {
    if (selectedValue !== undefined && currentQuestion) {
      submitQuestionAnswer(currentQuestion.id, selectedValue);
    }
  };

  if (!isStatusLoading && !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mx-6 max-w-md w-full flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-12 h-12 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
            Sesi Survei Belum Dibuat
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Anda belum memulai sesi survei. Silakan mulai survei terlebih dahulu sebelum mengisi evaluasi.
          </p>
          <button
            onClick={() => window.location.href = '/survey'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Mulai Survei Sekarang
          </button>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            Jika Anda merasa ini adalah kesalahan, silakan hubungi admin.
          </p>
        </div>
      </div>
    );
  }

  if (isStatusLoading || isLoading) {
    return (
      <div className="flex min-h-screen relative">
        {/* Background Layer */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Base Background Color */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-30 dark:opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                                        linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />

          {/* Subtle Dots Pattern */}
          <div
            className="absolute inset-0 opacity-10 dark:opacity-5"
            style={{
              backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Colored Blobs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 dark:bg-green-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        {/* Centered Loader */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader />
            {/* <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Sedang memuat...</p> */}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <CompletionScreen />;
  }

  if (!currentQuestion) {
    return null; // Or a better fallback UI
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {/* Base Background Color */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                              linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />

        {/* Subtle Dots Pattern */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Colored Blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Header with progress bar */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-5">
          <QuestionHeader
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
          <ProgressBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center relative z-10">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedValue={selectedValue}
            onSelect={handleAnswerSelect}
            onPrevious={goToPreviousQuestion}
            onNext={handleNext}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
          />
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default EvaluationPage;