"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import { useTheme } from '@/components/other/ThemeProvider';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';

const SurveyCompleted = () => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  // Cek status session dari server
  const { isLoading, sessionData } = useSurveyStatus();

  // Redirect jika session belum completed
  useEffect(() => {
    if (!isLoading) {
      if (!sessionData || sessionData.status !== "COMPLETED") {
        router.replace('/survey');
      }
    }
  }, [isLoading, sessionData, router]);

  // Countdown redirect ke evaluasi
  useEffect(() => {
    if (isLoading) return;
    if (countdown <= 0) {
      router.push('/survey/evaluation');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router, isLoading]);

  const handleManualClick = () => {
    router.push('/survey/evaluation');
  };

  if (isLoading || !sessionData || sessionData.status !== "COMPLETED") {
    // Jangan render apapun saat loading atau redirect
    return null;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-2xl w-full p-8 rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <FaCheckCircle className="text-8xl text-green-500" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Survei Berhasil Diselesaikan!
          </h1>
          <p className={`text-lg mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Terima kasih atas partisipasi Anda dalam survei ini. Jawaban Anda sangat berharga untuk kami.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                darkMode
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
              onClick={handleManualClick}
            >
              <MdAssignment className="text-xl" />
              Isi Evaluasi Survei
              <span className="ml-2 text-lg font-normal">
                ({countdown} s)
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-12 p-4 rounded-lg border ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <p className={`text-sm text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Jika Anda memiliki pertanyaan atau masukan, silakan hubungi tim kami melalui email{' '}
            <a 
              href="mailto:222112038@stis.ac.id"
              className="text-blue-500 hover:underline"
            >
              222112038@stis.ac.id
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyCompleted;