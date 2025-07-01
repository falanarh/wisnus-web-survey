"use client";

import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { completeSurveySession } from "@/services/survey/surveyService";
import { useRouter } from "next/navigation";
import { getUserData } from '@/services/auth';
import ModalKonfirmasiSubmit from './ModalKonfirmasiSubmit';
import { useTheme } from '@/components/other/ThemeProvider';

const SidebarStats: React.FC = () => {
  const { answers, errors, sessionId, activeQuestions, isLoading } = useSurvey();
  const [stats, setStats] = useState({
    answered: 0,
    blank: 0,
    error: 0,
    total: 0
  });
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (!activeQuestions) return;

    const totalQuestions = activeQuestions.length;
    
    const answeredCount = activeQuestions.filter(q => {
      const answer = answers[q.code];
      return answer !== undefined && answer !== null && String(answer).trim() !== '';
    }).length;
    
    const errorCount = activeQuestions.filter(q => !!errors[q.code]).length;
    
    const blankCount = Math.max(0, totalQuestions - answeredCount);
    
    setStats({
      answered: answeredCount,
      blank: blankCount,
      error: errorCount,
      total: totalQuestions
    });
  }, [answers, errors, activeQuestions]);

  const handleSubmit = async () => {
    try {
      let sid = sessionId;
      if (!sid) {
        const userData = getUserData();
        sid = userData?.activeSurveySessionId || null;
      }
      if (!sid) {
        alert("Session tidak ditemukan");
        return;
      }
      await completeSurveySession(sid);
      router.push("/survey/completed");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal mengakhiri sesi survei. Silakan coba lagi."
      );
    }
  };

  const isSubmitDisabled = stats.error > 0;

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat sesi survei...</div>;
  }

  return (
    <div className="mt-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>{stats.answered}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Answer</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>{stats.blank}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blank</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{stats.error}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Error</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{stats.total}</p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</p>
        </div>
      </div>
      <button 
        className={`w-full py-3 rounded-md transition font-semibold shadow-md ${
          isSubmitDisabled 
            ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-70' 
            : 'bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500'
        } text-white`}
        onClick={() => setShowConfirm(true)}
        disabled={isSubmitDisabled}
      >
        {isSubmitDisabled ? `Can't Submit (${stats.error} Error)` : 'Submit'}
      </button>
      
      {isSubmitDisabled && (
        <p className="mt-2 text-xs text-center text-red-500 dark:text-red-400">
          Mohon perbaiki kesalahan sebelum melanjutkan
        </p>
      )}
      <ModalKonfirmasiSubmit
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={async () => {
          setShowConfirm(false);
          await handleSubmit();
        }}
        sessionId={sessionId}
      />
    </div>
  );
};

export default SidebarStats;