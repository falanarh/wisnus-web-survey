"use client";

import React, { useEffect, useState } from 'react';
import { useSurvey } from '@/context/SurveyContext';
import { completeSurveySession } from "@/services/survey/surveyService";
import { useRouter } from "next/navigation";
import { getUserData } from '@/services/auth';
import ModalKonfirmasiSubmit from './ModalKonfirmasiSubmit';

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
    <div className="mt-auto p-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.answered}</p>
          <p className="text-sm">Answer</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.blank}</p>
          <p className="text-sm">Blank</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.error}</p>
          <p className="text-sm">Error</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold">{stats.total}</p>
          <p className="text-sm">Total</p>
        </div>
      </div>
      <button 
        className={`w-full py-3 rounded-md transition ${
          isSubmitDisabled 
            ? 'bg-gray-400 cursor-not-allowed opacity-70' 
            : 'bg-teal-400 hover:bg-teal-500'
        } text-white`}
        onClick={() => setShowConfirm(true)}
        disabled={isSubmitDisabled}
      >
        {isSubmitDisabled ? `Can't Submit (${stats.error} Error)` : 'Submit'}
      </button>
      
      {isSubmitDisabled && (
        <p className="mt-2 text-xs text-center text-red-500">
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