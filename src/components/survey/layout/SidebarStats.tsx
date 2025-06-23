"use client";

import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { surveyQuestions } from '../data/surveyQuestions';
import { characteristicQuestions } from '../data/characteristicQuestions';
import { completeSurveySession } from "@/services/survey/surveyService";
import { useRouter } from "next/navigation"; // atau "next/navigation" jika pakai app router

interface SidebarStatsProps {
  darkMode: boolean;
}

const SidebarStats: React.FC<SidebarStatsProps> = ({ darkMode }) => {
  const { answers, errors, sessionId } = useSurvey(); // pastikan sessionId tersedia di context
  const [stats, setStats] = useState({
    answered: 0,
    blank: 0,
    error: 0,
    remark: 0,
    total: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Calculate total questions from both survey and characteristic questions
    const allQuestions = [...surveyQuestions, ...characteristicQuestions];
    const totalQuestions = allQuestions.length;
    
    // Count answered questions
    const answeredCount = Object.values(answers).filter(value => 
      value && value.trim() !== ''
    ).length;
    
    // Count questions with errors
    const errorCount = Object.keys(errors).length;
    
    // Calculate blank questions (total minus answered)
    const blankCount = totalQuestions - answeredCount;
    
    // Update stats
    setStats({
      answered: answeredCount,
      blank: blankCount,
      error: errorCount,
      remark: 0, // Not currently tracking remarks, so keeping at 0
      total: totalQuestions
    });
  }, [answers, errors]);

  const handleSubmit = async () => {
    try {
      if (!sessionId) {
        alert("Session tidak ditemukan");
        return;
      }
      await completeSurveySession(sessionId);
      // Redirect ke halaman selesai, misal "/survey/completed"
      router.push("/survey/completed");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal mengakhiri sesi survei. Silakan coba lagi."
      );
    }
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = stats.error > 0;

  return (
    <div className="mt-auto p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.answered}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Answer</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.blank}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Blank</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.error}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Error</p>
        </div>
        <div className="text-center">
          <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stats.remark}</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Remark</p>
        </div>
      </div>
      <button 
        className={`w-full py-3 rounded-md transition ${
          isSubmitDisabled 
            ? 'bg-gray-400 cursor-not-allowed opacity-70' 
            : 'bg-teal-400 hover:bg-teal-500'
        } text-white`}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        {isSubmitDisabled ? `Can't Submit (${stats.error} Error)` : 'Submit'}
      </button>
      
      {isSubmitDisabled && (
        <p className="mt-2 text-xs text-center text-red-500">
          Mohon perbaiki kesalahan pada formulir sebelum melanjutkan
        </p>
      )}
    </div>
  );
};

export default SidebarStats;