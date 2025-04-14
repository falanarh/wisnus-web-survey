import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SurveyStartPopupProps {
  darkMode: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SurveyStartPopup: React.FC<SurveyStartPopupProps> = ({
  darkMode,
  onConfirm,
  onCancel,
  isLoading
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-md rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Mulai Survei?
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Anda akan memulai sesi survei baru. Pastikan Anda memiliki waktu yang cukup untuk menyelesaikan survei ini.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Nanti Saja
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-md 
                bg-blue-600 text-white hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memulai...
                </>
              ) : (
                'Mulai Sekarang'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SurveyStartPopup;