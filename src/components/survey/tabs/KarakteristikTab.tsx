import React, { useEffect, useState } from 'react';
import QuestionComponent from '../ui/QuestionComponent';
import { characteristicQuestions } from '../data/characteristicQuestions';
// import { surveyQuestions } from '../data/surveyQuestions';
import { useSurvey } from '@/context/SurveyContext';
import { completeSurveySession, updateTimeConsumed } from "@/services/survey/surveyService";
import { useRouter } from "next/navigation";
import { getUserData } from '@/services/auth';
import ModalKonfirmasiSubmit from '../layout/ModalKonfirmasiSubmit';
import { useTheme } from '@/components/other/ThemeProvider';

const KarakteristikTab: React.FC = () => {
  const { isLoading, sessionId, timeConsumed, setTimeConsumed, lastSwitchTime } = useSurvey();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

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
      // Update waktu konsumsi tab karakteristik sebelum submit
      const now = Date.now();
      const timeSpent = now - lastSwitchTime.current;
      const updated = {
        ...currentTimeConsumed,
        karakteristik: currentTimeConsumed['karakteristik'] + timeSpent
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Memuat data karakteristik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 md:p-7 rounded-md`}>
      <div className="w-full min-h-screen space-y-8 pb-48 overflow-y-auto">
        {characteristicQuestions.map((question) => (
          <QuestionComponent 
            key={question.code} 
            question={question} 
            darkMode={darkMode} 
          />
        ))}
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

export default KarakteristikTab;