import React, { useEffect, useState } from 'react';
import { surveyQuestions } from '../data/surveyQuestions';
import QuestionComponent from '../ui/QuestionComponent';
import { useSurvey } from '@/context/SurveyContext';
import { completeSurveySession, updateTimeConsumed } from "@/services/survey/surveyService";
import { useRouter } from "next/navigation";
import { getUserData } from '@/services/auth';
import { useTheme } from '@/components/other/ThemeProvider';
import ModalKonfirmasiSubmit from '../layout/ModalKonfirmasiSubmit';

const SurveiTab: React.FC = () => {
  const { isLoading, answers, errors, sessionId, activeQuestions, timeConsumed, setTimeConsumed, lastSwitchTime } = useSurvey();
  const [stats, setStats] = useState({
    answered: 0,
    blank: 0,
    error: 0,
    total: 0
  });
  const router = useRouter();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSubmit = async () => {
    try {
      // Ambil timeConsumed terbaru dari localStorage/context
      let currentTimeConsumed = timeConsumed;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('timeConsumed');
        if (stored) {
          try {
            currentTimeConsumed = JSON.parse(stored);
          } catch {}
        }
      }
      // Update waktu konsumsi tab survei sebelum submit
      const now = Date.now();
      const timeSpent = now - lastSwitchTime.current;
      const updated = {
        ...currentTimeConsumed,
        survei: currentTimeConsumed['survei'] + timeSpent
      };
      if (sessionId) {
        await updateTimeConsumed(sessionId, updated);
      }
      setTimeConsumed(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeConsumed', JSON.stringify(updated));
      }
      lastSwitchTime.current = now;
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Memuat data survei...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 md:p-7 rounded-md`}>
      <div className="w-full min-h-screen space-y-8 pb-48 overflow-y-auto">
        {surveyQuestions.map((question) => (
          <QuestionComponent 
            key={question.code} 
            question={question} 
            darkMode={darkMode} 
          />
        ))}
      </div>
      
      {/* Mobile Submit Button - Hidden on desktop */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-30">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>{stats.answered}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Answer</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>{stats.blank}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blank</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{stats.error}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Error</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>{stats.total}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</p>
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
      </div>
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

export default SurveiTab;